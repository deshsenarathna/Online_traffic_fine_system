import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Handles all secure local persistence of authentication data.
///
/// - JWT token  → [FlutterSecureStorage]  (encrypted keychain/keystore)
/// - User info  → [SharedPreferences]     (non-sensitive display data)
class AuthStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const _keyToken     = 'driver_jwt_token';
  static const _keyFullName  = 'driver_full_name';
  static const _keyEmail     = 'driver_email';

  // ──────────────────────────────────────────────────────────────
  // Write
  // ──────────────────────────────────────────────────────────────

  static Future<void> saveSession({
    required String token,
    required String fullName,
    required String email,
  }) async {
    await _storage.write(key: _keyToken, value: token);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyFullName, fullName);
    await prefs.setString(_keyEmail, email);
  }

  // ──────────────────────────────────────────────────────────────
  // Read
  // ──────────────────────────────────────────────────────────────

  static Future<String?> getToken() => _storage.read(key: _keyToken);

  static Future<String?> getFullName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyFullName);
  }

  static Future<String?> getEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyEmail);
  }

  /// Returns true when a JWT token is stored (user is logged in).
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // ──────────────────────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────────────────────

  static Future<void> clearSession() async {
    await _storage.delete(key: _keyToken);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFullName);
    await prefs.remove(_keyEmail);
  }
}
