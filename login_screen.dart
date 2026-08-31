import 'package:flutter/material.dart';
import 'api_service.dart';
import 'main_navigation.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override:
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  bool _isOtpSent = false;
  bool _isLoading = false;

  void _handleRequestOtp() async {
    setState(() => _isLoading = true);
    final res = await ApiService.requestOtp(_phoneController.text);
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      setState(() => _isOtpSent = true);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['message'] ?? 'کد تأیید ارسال شد.')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['message'] ?? 'خطا در ارسال کد.')),
      );
    }
  }

  void _handleVerifyOtp() async {
    setState(() => _isLoading = true);
    final res = await ApiService.verifyOtp(_phoneController.text, _otpController.text);
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainNavigation()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['message'] ?? 'کد اشتباه است.')),
      );
    }
  }

  void _handleGuestLogin() async {
    setState(() => _isLoading = true);
    final res = await ApiService.loginAsGuest();
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainNavigation()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E1E1E),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'حکم مستر',
                style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.amber),
              ),
              const SizedBox(height: 40),
              if (!_isOtpSent) ...[
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'شماره همراه (+98)',
                    labelStyle: const TextStyle(color: Colors.grey),
                    enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: Colors.amber)),
                    focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: Colors.amberAccent)),
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleRequestOtp,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.amber,
                    minimumSize: const Size.fromHeight(50),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('ارسال کد تأیید', style: TextStyle(color: Colors.black, fontSize: 18)),
                ),
                const SizedBox(height: 15),
                TextButton(
                  onPressed: _handleGuestLogin,
                  child: const Text('ورود به‌عنو‌ان مهمان', style: TextStyle(color: Colors.white70)),
                ),
              ] else ...[
                TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'کد ۶ رقمی',
                    labelStyle: TextStyle(color: Colors.grey),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.amber)),
                    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.amberAccent)),
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleVerifyOtp,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.amber,
                    minimumSize: const Size.fromHeight(50),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('تأیید و ورود', style: TextStyle(color: Colors.black, fontSize: 18)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
