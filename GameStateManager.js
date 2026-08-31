const CardEngine = require('./CardEngine');

class GameStateManager {
  constructor() {
    this.activeGames = new Map(); // roomId -> gameState
  }

  // ایجاد حالت جدید برای شروع بازی
  initGame(roomId, players, targetHands) {
    const gameState = {
      roomId,
      players, // [{ userId, socketId, position, team, hand: [] }]
      targetHands,
      teamScores: [0, 0], // امتیاز کل بازی (دست‌ها)
      currentTrickScores: [0, 0], // تعداد زمینه‌های برده شده در این دست (تا ۷)
      hakemPosition: Math.floor(Math.random() * 4),
      turnPosition: null,
      hokmSuit: null,
      deck: [],
      currentTrick: [], // [{ playerId, position, card }]
      phase: 'DEALING_HOKM_CARDS' // PHASES: DEALING_HOKM_CARDS, WAITING_FOR_HOKM, PLAYING, ROUND_END
    };

    this.activeGames.set(roomId.toString(), gameState);
    return gameState;
  }

  getGame(roomId) {
    return this.activeGames.get(roomId.toString());
  }

  // پخش ۵ کارت اول به حاکم برای تعیین حکم
  startNewHand(roomId) {
    const game = this.getGame(roomId);
    if (!game) return null;

    game.deck = CardEngine.shuffle(CardEngine.createDeck());
    game.currentTrickScores = [0, 0];
    game.hokmSuit = null;
    game.currentTrick = [];

    // دادن ۵ کارت اول به هر بازیکن (ابتدا حاکم)
    game.players.forEach(p => {
      p.hand = game.deck.splice(0, 5);
    });

    game.phase = 'WAITING_FOR_HOKM';
    game.turnPosition = game.hakemPosition;
    return game;
  }

  // ثبت حکم توسط حاکم و پخش باقی‌مانده کارت‌ها (۸ کارت به هر نفر)
  setHokmAndDealRest(roomId, suit) {
    const game = this.getGame(roomId);
    if (!game) return null;

    game.hokmSuit = suit;
    game.phase = 'PLAYING';

    // پخش ۸ کارت باقی‌مانده به هر بازیکن
    game.players.forEach(p => {
      const restCards = game.deck.splice(0, 8);
      p.hand = [...p.hand, ...restCards];
    });

    // نوبت شروع بازی با حاکم است
    game.turnPosition = game.hakemPosition;
    return game;
  }

  // بازی کردن یک کارت توسط بازیکن
  playCard(roomId, userId, cardId) {
    const game = this.getGame(roomId);
    if (!game) return { error: 'بازی یافت نشد.' };

    const player = game.players.find(p => p.userId.toString() === userId.toString());
    if (!player || player.position !== game.turnPosition) {
      return { error: 'نوبت شما نیست.' };
    }

    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) {
      return { error: 'این کارت در دست شما نیست.' };
    }

    const cardToPlay = player.hand[cardIndex];

    // قوانین خال زمینه: اگر کارت از خال زمینه باشد یا بازیکن آن خال را نداشته باشد
    if (game.currentTrick.length > 0) {
      const leadSuit = game.currentTrick[0].card.suit;
      const hasLeadSuit = player.hand.some(c => c.suit === leadSuit);
      if (hasLeadSuit && cardToPlay.suit !== leadSuit) {
        return { error: 'شما باید خال زمینه را بازی کنید.' };
      }
    }

    // برداشتن کارت از دست بازیکن و بستن روی میز
    player.hand.splice(cardIndex, 1);
    game.currentTrick.push({
      userId: player.userId,
      position: player.position,
      card: cardToPlay
    });

    // تغییر نوبت به نفر بعدی (ساعت‌گرد)
    game.turnPosition = (game.turnPosition + 1) % 4;

    return { success: true, game };
  }

  // بررسی پایان یک زمینه (۴ کارت بازی شده)
  evaluateTrick(roomId) {
    const game = this.getGame(roomId);
    if (!game || game.currentTrick.length < 4) return null;

    const winnerUserId = CardEngine.getTrickWinner(
      game.currentTrick.map(t => ({ playerId: t.userId, card: t.card })),
      game.hokmSuit
    );

    const winnerPlayer = game.players.find(p => p.userId.toString() === winnerUserId.toString());
    game.currentTrickScores[winnerPlayer.team] += 1;

    // برنده زمینه، شروع‌کننده زمینه بعدی است
    game.turnPosition = winnerPlayer.position;
    const trickResult = {
      winnerUserId,
      winnerPosition: winnerPlayer.position,
      winnerTeam: winnerPlayer.team,
      currentTrickScores: [...game.currentTrickScores],
      playedTrick: [...game.currentTrick]
    };

    game.currentTrick = [];
    return trickResult;
  }

  removeGame(roomId) {
    this.activeGames.delete(roomId.toString());
  }
}

module.exports = new GameStateManager();
