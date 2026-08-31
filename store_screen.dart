import 'package:flutter/material.dart';

class StoreScreen extends StatelessWidget {
  const StoreScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF181818),
      appBar: AppBar(
        backgroundColor: const Color(0xFF282828),
        title: const Text('فروشگاه', style: TextStyle(color: Colors.white)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          _buildStoreItem('بسته ۱,۰۰۰ سکه', '۱۰,۰۰۰ تومان', Icons.monetization_on),
          _buildStoreItem('اشتراک VIP یک‌ماهه', '۵۰,۰۰۰ تومان', Icons.star),
          _buildStoreItem('پشت کارت مخمل شاهانه', '۵,۰۰۰ سکه', Icons.style),
        ],
      ),
    );
  }

  Widget _buildStoreItem(String title, String price, IconData icon) {
    return Card(
      color: const Color(0xFF2C2C2C),
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: Colors.amber, size: 32),
        title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        subtitle: Text(price, style: const TextStyle(color: Colors.amberAccent)),
        trailing: ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
          child: const Text('خرید', style: TextStyle(color: Colors.black)),
        ),
      ),
    );
  }
}
