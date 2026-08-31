import 'package:socket_io_client/socket_io_client.dart' as io;
import 'app_constants.dart';

class SocketService {
  late io.Socket socket;

  void connect() {
    socket = io.io(
      AppConstants.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    socket.connect();

    socket.onConnect((_) {
      print('[Socket] Connected to server');
    });

    socket.onDisconnect((_) {
      print('[Socket] Disconnected from server');
    });
  }

  void joinRoom(String roomId, String userId) {
    socket.emit('join_room', {'roomId': roomId, 'userId': userId});
  }

  void declareHokm(String roomId, String suit) {
    socket.emit('declare_hokm', {'roomId': roomId, 'suit': suit});
  }

  void playCard(String roomId, String userId, String cardId) {
    socket.emit('play_card', {
      'roomId': roomId,
      'userId': userId,
      'cardId': cardId,
    });
  }

  void disconnect() {
    socket.disconnect();
  }
}
