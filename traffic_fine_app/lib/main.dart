import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'services/auth_storage.dart';
import 'screens/sign_in_screen.dart';
import 'screens/home_screen.dart';

void main() async {
  // Required before using any plugin or async work before runApp()
  WidgetsFlutterBinding.ensureInitialized();

  // Lock to portrait mode
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Check if a JWT token is already stored (user was previously logged in)
  final bool alreadyLoggedIn = await AuthStorage.isLoggedIn();

  runApp(TrafficFineApp(startLoggedIn: alreadyLoggedIn));
}

class TrafficFineApp extends StatelessWidget {
  const TrafficFineApp({Key? key, required this.startLoggedIn})
      : super(key: key);

  /// True  → go directly to HomeScreen (token found in secure storage)
  /// False → show SignInScreen
  final bool startLoggedIn;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Traffic Fine Pay',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4A90E2),
          brightness: Brightness.dark,
        ),
        fontFamily: 'Roboto',
        scaffoldBackgroundColor: const Color(0xFF0A0E27),
      ),
      // ── Initial route: check login state ───────────────────────
      home: startLoggedIn ? const HomeScreen() : const SignInScreen(),

      // ── Named routes (optional, for future deep linking) ───────
      routes: {
        '/sign-in': (_) => const SignInScreen(),
        '/home':    (_) => const HomeScreen(),
      },
    );
  }
}