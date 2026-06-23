import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_storage.dart';

/// Central API service for the Traffic Fine app.
///
/// Sections:
///   1. Driver Authentication  → /api/driver-auth/...
///   2. Fine & Payment         → /api/fines/... + /api/payments/...
class ApiService {
  // ── Change this to your machine's local IP when testing on a real device ──
  static const String baseUrl = 'http://10.147.52.125:8080/api';

  // ──────────────────────────────────────────────────────────────
  // 1.  DRIVER AUTHENTICATION
  // ──────────────────────────────────────────────────────────────

  /// POST /api/driver-auth/signup
  ///
  /// Body: { fullName, email, password, licenseNumber, phoneNumber }
  /// Returns: { token, fullName, email }
  static Future<Map<String, dynamic>> signup({
    required String fullName,
    required String email,
    required String password,
    required String licenseNumber,
    required String phoneNumber,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/driver-auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'fullName': fullName,
        'email': email,
        'password': password,
        'licenseNumber': licenseNumber,
        'phoneNumber': phoneNumber,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 201) {
      return data as Map<String, dynamic>;
    } else {
      // Backend sends { message: "..." } on error
      final msg = data['message'] ?? 'Sign-up failed. Please try again.';
      throw Exception(msg);
    }
  }

  /// POST /api/driver-auth/login
  ///
  /// Body: { email, password }
  /// Returns: { token, fullName, email }
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/driver-auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return data as Map<String, dynamic>;
    } else {
      final msg = data['message'] ?? 'Invalid email or password.';
      throw Exception(msg);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 2.  FINE & PAYMENT  (unchanged from original)
  // ──────────────────────────────────────────────────────────────

  /// Two-step process:
  ///   Step 1 – POST /api/fines/create       (record the fine)
  ///   Step 2 – POST /api/payments/initiate  (get PayHere hash & details)
  static Future<Map<String, dynamic>> initiatePayment({
    required String referenceNumber,
    required String categoryCode,
    required String officerBadgeNumber,
    required String driverName,
    required String driverLicenseNumber,
    required String vehicleNumber,
    required String paymentMethod,
  }) async {
    // ── Step 1: Record the fine ──────────────────────────────────
    await http.post(
      Uri.parse('$baseUrl/fines/create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'referenceNumber': referenceNumber,
        'categoryCode': categoryCode,
        'officerBadgeNumber': officerBadgeNumber,
        'driverName': driverName,
        'driverLicenseNumber': driverLicenseNumber,
        'vehicleNumber': vehicleNumber,
      }),
    );

    // ── Step 2: Initiate payment with PayHere ────────────────────
    final payResponse = await http.post(
      Uri.parse('$baseUrl/payments/initiate'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'referenceNumber': referenceNumber,
        'paymentMethod': paymentMethod,
      }),
    );

    if (payResponse.statusCode == 200 || payResponse.statusCode == 201) {
      return jsonDecode(payResponse.body) as Map<String, dynamic>;
    } else {
      throw Exception('Payment initiation failed: ${payResponse.body}');
    }
  }
}