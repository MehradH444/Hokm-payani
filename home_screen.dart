import 'package:flutter/material.dart';
import 'api_service.dart';
import 'game_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int coins = 1000;
  String displayName = 'بازیکن';

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  void _loadProfile() async {
    final res = await ApiService.getProfile();
    if (res['success'] == true && res['user'] != null) {
      setState(() {
        coins = res['user']['coins'] ?? 1000;
        displayName = res['user']['displayName'] ?? 'بازیکن';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF141414),
      appBar: AppBar(
        backgroundColor: const Color(0xFF222222),
        title: Text(displayName, style: const TextStyle(color: Colors.white)),
        actions: [
          Row(
            children: [
              const Icon(Icons.monetization_on, color: Colors.amber),
              const SizedBox(width: 5),
              Text('$coins', style: const TextStyle(color: Colors.white, fontSize: 16)),
              const SizedBox(width: 15),
            ],
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber.shade900,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('سکه‌های رایگان امروز!', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  Icon(Icons.card_giftcard, color: Colors.white),
                ],
              ),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const GameScreen(roomId: 'demo_room')),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 20),
                minimumSize: const Size.fromHeight(60),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
              child: const Text('شروع بازی سریع', style: TextStyle(fontSize: 22, color: Colors.white, fontWeight: FontWeight.bold)),
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }
}
