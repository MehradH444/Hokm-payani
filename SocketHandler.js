const GameRoom = require('./GameRoom');
const gameStateManager = require('./GameStateManager');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket connected]: ${socket.id}`);

    // ۱. پیوستن به اتاق بازی
    socket.on('join_room', async ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        const room = await GameRoom.findById(roomId).populate('players.user');
        
        io.to(roomId).emit('room_updated', room);

        // اگر ۴ نفر تکمیل شده باشند، شروع بازی
        if (room.players.length === 4 && room.status === 'WAITING') {
          room.status = 'PLAYING';
          await room.save();

          const formattedPlayers = room.players.map(p => ({
            userId: p.user._id,
            socketId: p.socketId,
            position: p.position,
            team: p.team,
            displayName: p.user.displayName,
            avatar: p.user.avatar,
            hand: []
          }));

          const game = gameStateManager.initGame(room._id, formattedPlayers, room.targetHands);
          gameStateManager.startNewHand(room._id);

          io.to(roomId).emit('game_started', {
            hakemPosition: game.hakemPosition,
            turnPosition: game.turnPosition,
            phase: game.phase
          });

          // ارسال ۵ کارت اول خصوصی به هر بازیکن
          game.players.forEach(p => {
            io.to(p.socketId).emit('your_hand', p.hand);
          });
        }
      } catch (err) {
        console.error('[Socket join_room error]:', err);
      }
    });

    // ۲. تعیین خال حکم توسط حاکم
    socket.on('declare_hokm', ({ roomId, suit }) => {
      const game = gameStateManager.setHokmAndDealRest(roomId, suit);
      if (!game) return;

      io.to(roomId).emit('hokm_declared', {
        hokmSuit: game.hokmSuit,
        turnPosition: game.turnPosition
      });

      // ارسال کارت‌های کامل (۱۳ کارت) خصوصی به همه
      game.players.forEach(p => {
        io.to(p.socketId).emit('your_hand', p.hand);
      });
    });

    // ۳. انداختن کارت روی میز
    socket.on('play_card', ({ roomId, userId, cardId }) => {
      const result = gameStateManager.playCard(roomId, userId, cardId);
      
      if (result.error) {
        return socket.emit('error_message', result.error);
      }

      const game = result.game;
      io.to(roomId).emit('card_played', {
        userId,
        cardId,
        currentTrick: game.currentTrick,
        turnPosition: game.turnPosition
      });

      // ارزیابی زمینه در صورت تکمیل ۴ کارت
      if (game.currentTrick.length === 4) {
        setTimeout(() => {
          const trickResult = gameStateManager.evaluateTrick(roomId);
          io.to(roomId).emit('trick_completed', trickResult);
        }, 1200); // تاخیر برای مشاهده کارت‌ها توسط کاربران
      }
    });

    // ۴. ارسال استیکر یا متن پیام سریع (Quick Chat)[span_3](start_span)[span_3](end_span)
    socket.on('send_reaction', ({ roomId, userId, type, content }) => {
      io.to(roomId).emit('reaction_received', { userId, type, content });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket disconnected]: ${socket.id}`);
    });
  });
};
