import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // ඔයාගේ ලැප් එකේ IP Address එක සහ Spring Boot Port එක
  static const String baseUrl = 'http://10.147.52.125:8080/api';

  static Future<Map<String, dynamic>> initiatePayment({
    required String referenceNumber,
    required String categoryCode,
    required String officerBadgeNumber,
    required String driverName,
    required String driverLicenseNumber,
    required String vehicleNumber,
    required String paymentMethod,
  }) async {
    try {
      // 1. මුලින්ම දඩය System එකට ඇතුළත් කරනවා
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

      // 2. ඊටපස්සේ Payment එක Initiate කරලා PayHere එකට ඕනෙ Hash එකයි විස්තරයි ගන්නවා
      final payResponse = await http.post(
        Uri.parse('$baseUrl/payments/initiate'), 
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'referenceNumber': referenceNumber,
          'paymentMethod': paymentMethod,
        }),
      );

      if (payResponse.statusCode == 200 || payResponse.statusCode == 201) {
        return jsonDecode(payResponse.body); // PayHere Hash එක ඇතුළු විස්තර ටික
      } else {
        throw Exception('Payment initiation failed: ${payResponse.body}');
      }
    } catch (e) {
      throw Exception('Network or Server Error: $e');
    }
  }
}