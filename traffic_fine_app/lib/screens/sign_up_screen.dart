import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/auth_storage.dart';
import 'sign_in_screen.dart';
import 'home_screen.dart';

/// Sign-up screen.
///
/// Fields match the backend [DriverSignupRequest] DTO exactly:
///   fullName, email, password, licenseNumber, phoneNumber
class SignUpScreen extends StatefulWidget {
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController    = TextEditingController();
  final _emailController       = TextEditingController();
  final _phoneController       = TextEditingController();
  final _licenseController     = TextEditingController();
  final _passwordController    = TextEditingController();
  final _confirmPassController = TextEditingController();

  bool _isLoading       = false;
  bool _obscurePass     = true;
  bool _obscureConfirm  = true;
  String? _errorMessage;

  late AnimationController _animController;
  late Animation<double>   _fadeAnim;
  late Animation<Offset>   _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnim =
        CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _licenseController.dispose();
    _passwordController.dispose();
    _confirmPassController.dispose();
    super.dispose();
  }

  // ── Sign-up logic ───────────────────────────────────────────────

  Future<void> _handleSignUp() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _errorMessage = null; });

    try {
      final data = await ApiService.signup(
        fullName:      _fullNameController.text.trim(),
        email:         _emailController.text.trim(),
        password:      _passwordController.text,
        licenseNumber: _licenseController.text.trim().toUpperCase(),
        phoneNumber:   _phoneController.text.trim(),
      );

      // Auto-login after successful registration
      await AuthStorage.saveSession(
        token:    data['token'],
        fullName: data['fullName'],
        email:    data['email'],
      );

      if (!mounted) return;
      // Replace entire navigation stack with Home
      Navigator.of(context).pushAndRemoveUntil(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => const HomeScreen(),
          transitionsBuilder: (_, anim, __, child) =>
              FadeTransition(opacity: anim, child: child),
          transitionDuration: const Duration(milliseconds: 400),
        ),
        (route) => false,
      );
    } on Exception catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // ── UI ──────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          child: FadeTransition(
            opacity: _fadeAnim,
            child: SlideTransition(
              position: _slideAnim,
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // ── Back button ──────────────────────────────
                    Align(
                      alignment: Alignment.centerLeft,
                      child: GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF141836),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                                color: Colors.white.withOpacity(0.08)),
                          ),
                          child: const Icon(Icons.arrow_back_ios_new_rounded,
                              color: Color(0xFF8A94B4), size: 18),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── Shield icon ──────────────────────────────
                    Center(
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF26C6DA), Color(0xFF006064)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF26C6DA).withOpacity(0.40),
                              blurRadius: 24,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Icon(Icons.shield_outlined,
                            size: 38, color: Colors.white),
                      ),
                    ),

                    const SizedBox(height: 22),

                    const Text(
                      'Create Account',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Register as a driver to pay fines online',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF8A94B4), fontSize: 14),
                    ),

                    const SizedBox(height: 32),

                    // ── Error banner ─────────────────────────────
                    if (_errorMessage != null) ...[
                      _ErrorBanner(message: _errorMessage!),
                      const SizedBox(height: 18),
                    ],

                    // ── Section label ────────────────────────────
                    _SectionLabel(label: 'Personal Information'),
                    const SizedBox(height: 12),

                    _AuthField(
                      controller: _fullNameController,
                      label: 'Full Name',
                      icon: Icons.person_outline_rounded,
                      keyboardType: TextInputType.name,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Please enter your full name';
                        }
                        if (v.trim().length < 3) return 'Name is too short';
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _AuthField(
                      controller: _emailController,
                      label: 'Email Address',
                      icon: Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!v.contains('@') || !v.contains('.')) {
                          return 'Enter a valid email address';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _AuthField(
                      controller: _phoneController,
                      label: 'Phone Number',
                      icon: Icons.phone_outlined,
                      keyboardType: TextInputType.phone,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Please enter your phone number';
                        }
                        if (v.trim().length < 9) {
                          return 'Enter a valid phone number';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 22),
                    _SectionLabel(label: 'Driver Credentials'),
                    const SizedBox(height: 12),

                    _AuthField(
                      controller: _licenseController,
                      label: 'Driving License Number',
                      icon: Icons.card_membership_rounded,
                      keyboardType: TextInputType.text,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Please enter your license number';
                        }
                        // Pattern: B1234567 (letter + 7 digits)
                        final pattern = RegExp(r'^[A-Za-z]\d{7}$');
                        if (!pattern.hasMatch(v.trim())) {
                          return 'Format: B1234567 (letter + 7 digits)';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 22),
                    _SectionLabel(label: 'Security'),
                    const SizedBox(height: 12),

                    _AuthField(
                      controller: _passwordController,
                      label: 'Password',
                      icon: Icons.lock_outline_rounded,
                      obscureText: _obscurePass,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePass
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                          color: const Color(0xFF8A94B4),
                        ),
                        onPressed: () =>
                            setState(() => _obscurePass = !_obscurePass),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Please enter a password';
                        }
                        if (v.length < 8) {
                          return 'Password must be at least 8 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _AuthField(
                      controller: _confirmPassController,
                      label: 'Confirm Password',
                      icon: Icons.lock_outline_rounded,
                      obscureText: _obscureConfirm,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureConfirm
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                          color: const Color(0xFF8A94B4),
                        ),
                        onPressed: () =>
                            setState(() => _obscureConfirm = !_obscureConfirm),
                      ),
                      validator: (v) {
                        if (v != _passwordController.text) {
                          return 'Passwords do not match';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 32),

                    _GradientButton(
                      label: 'Create Account',
                      isLoading: _isLoading,
                      onPressed: _handleSignUp,
                      gradientColors: const [
                        Color(0xFF26C6DA),
                        Color(0xFF006064),
                      ],
                    ),

                    const SizedBox(height: 22),

                    // ── Already have an account ──────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Already have an account? ',
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.45),
                                fontSize: 14)),
                        GestureDetector(
                          onTap: () => Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                                builder: (_) => const SignInScreen()),
                          ),
                          child: const Text(
                            'Sign In',
                            style: TextStyle(
                              color: Color(0xFF26C6DA),
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Section label widget ────────────────────────────────────────────────────

class _SectionLabel extends StatelessWidget {
  const _SectionLabel({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 3,
          height: 14,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF26C6DA), Color(0xFF006064)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF8A94B4),
            fontSize: 12,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.2,
          ),
        ),
      ],
    );
  }
}

// ── Re-export shared widgets from sign_in_screen.dart ──────────────────────
//    (They are defined there as package-private classes so they can be
//     used here because they share the same library scope in Dart.)

// ignore: avoid_classes_with_only_static_members
class _AuthField extends StatelessWidget {
  const _AuthField({
    required this.controller,
    required this.label,
    required this.icon,
    this.keyboardType,
    this.obscureText = false,
    this.suffixIcon,
    this.validator,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: const TextStyle(color: Colors.white, fontSize: 15),
      cursorColor: const Color(0xFF26C6DA),
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF8A94B4), fontSize: 14),
        prefixIcon: Icon(icon, color: const Color(0xFF26C6DA), size: 22),
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: const Color(0xFF141836),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide:
              BorderSide(color: Colors.white.withOpacity(0.08), width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide:
              const BorderSide(color: Color(0xFF26C6DA), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide:
              const BorderSide(color: Color(0xFFFF5252), width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide:
              const BorderSide(color: Color(0xFFFF5252), width: 2),
        ),
        errorStyle: const TextStyle(color: Color(0xFFFF5252)),
        contentPadding:
            const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
      ),
    );
  }
}

class _GradientButton extends StatelessWidget {
  const _GradientButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.gradientColors = const [Color(0xFF4A90E2), Color(0xFF1565C0)],
  });

  final String label;
  final VoidCallback onPressed;
  final bool isLoading;
  final List<Color> gradientColors;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 58,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient:
            LinearGradient(colors: gradientColors, begin: Alignment.topLeft, end: Alignment.bottomRight),
        boxShadow: [
          BoxShadow(
            color: gradientColors.first.withOpacity(0.40),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14)),
        ),
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                    strokeWidth: 2.5, color: Colors.white),
              )
            : Text(label,
                style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: 0.8)),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFFF5252).withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
            color: const Color(0xFFFF5252).withOpacity(0.35), width: 1),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline_rounded,
              color: Color(0xFFFF5252), size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Color(0xFFFF7070), fontSize: 13.5),
            ),
          ),
        ],
      ),
    );
  }
}
