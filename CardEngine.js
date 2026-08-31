// تعریف خال‌ها و ارزش کارت‌ها
const SUITS = ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES']; // دل، خاج، خشت، پیک
const VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11: سرباز, 12: بی‌بی, 13: شاه, 14: تک (آس)

class CardEngine {
  // ساخت دست کامل ۵۲ تایی کارت
  static createDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        deck.push({ suit, value, id: `${suit}_${value}` });
      }
    }
    return deck;
  }

  // بر زدن کارت‌ها به روش Fisher-Yates
  static shuffle(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // محاسبه برنده یک زمینه (Trick) ۴ کارته
  static getTrickWinner(playedCards, hokmSuit) {
    // playedCards: [{ playerId, card: { suit, value } }, ...]
    const leadSuit = playedCards[0].card.suit;

    let winningPlay = playedCards[0];

    for (let i = 1; i < playedCards.length; i++) {
      const current = playedCards[i];
      const winning = winningPlay;

      // اگر کارت فعلی حکم باشد
      if (current.card.suit === hokmSuit) {
        if (winning.card.suit !== hokmSuit) {
          winningPlay = current;
        } else if (current.card.value > winning.card.value) {
          winningPlay = current;
        }
      } 
      // اگر کارت فعلی از خال زمینه باشد و کارت برنده فعلی حکم نباشد
      else if (current.card.suit === leadSuit && winning.card.suit !== hokmSuit) {
        if (current.card.value > winning.card.value) {
          winningPlay = current;
        }
      }
    }

    return winningPlay.playerId;
  }
}

module.exports = CardEngine;
