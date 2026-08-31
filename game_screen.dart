import 'package:flutter/material.dart';
import 'socket_service.dart';

class GameScreen extends StatefulWidget {
  final String roomId;
  const GameScreen({Key? key, required this.roomId}) : super(key: key);

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  final SocketService _socketService = SocketService();
  List<String> myCards = ['HEARTS_14', 'SPADES_13', 'CLUBS_10', 'DIAMONDS_7'];

  @override
  void initState() {
    super.initState();
    _socketService.connect();
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F380F), // تم سبز میز بازی
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('میز بازی حکم', style: TextStyle(color: Colors.white)),
      ),
      body: Column(
        children: [
          // بازیکن یار بالا (شمال)
          const CircleAvatar(backgroundColor: Colors.amber, child: Icon(Icons.person)),
          const Spacer(),
          // میز وسط بازی
          Container(
            width: 200,
            height: 150,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.white24, width: 2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Center(
              child: Text('کارت‌های روی میز', style: TextStyle(color: Colors.white38)),
            ),
          ),
          const Spacer(),
          // دست کارت‌های من (جنوب)
          SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: myCards.length,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    _socketService.playCard(widget.roomId, 'my_user_id', myCards[index]);
                  },
                  child: Container(
                    width: 70,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.black26),
                    ),
                    child: Center(
                      child: Text(
                        myCards[index],
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
