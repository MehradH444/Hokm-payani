import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'app_constants.dart';

class ApiService {
  // دریافت توکن ذخیره شده
  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConstants.tokenKey);
  }

  // ۱. درخواست ارسال کد OTP
  static Future<Map<String, dynamic>> requestOtp(String phoneNumber) async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/auth/request-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phoneNumber': phoneNumber}),
    );
    return jsonDecode(response.body);
  }

  // ۲. تایید OTP
  static Future<Map<String, dynamic>> verifyOtp(String phoneNumber, String code, {String? referralCode}) async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/auth/verify-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'code': code,
        if (referralCode != null) 'referralCode': referralCode,
      }),
    );
    return jsonDecode(response.body);
  }

  // ۳. ورود مهمان
  static Future<Map<String, dynamic>> loginAsGuest() async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/auth/guest-login'),
      headers: {'Content-Type': 'application/json'},
    );
    return jsonDecode(response.body);
  }

  // ۴. دریافت پروفایل کاربر
  static Future<Map<String, dynamic>> getProfile() async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('${AppConstants.baseUrl}/user/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    return jsonDecode(response.body);
  }
}
