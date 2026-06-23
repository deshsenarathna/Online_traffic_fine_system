import 'package:flutter/material.dart';
import '../services/auth_storage.dart';
import 'sign_in_screen.dart';
import 'payment_form_screen.dart';

/// Home / Dashboard screen shown after successful authentication.
///
/// Displays:
///  - Greeting with the driver's full name
///  - Summary info cards (email, license status)
///  - Primary CTA: "Pay Traffic Fine" → PaymentFormScreen
///  - Sign out button
class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  String _fullName = '';
  String _email    = '';
  bool   _isLoading = true;

  late AnimationController _animController;
  late Animation<double>   _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _fadeAnim =
        CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _loadUser();
  }

  Future<void> _loadUser() async {
    final name  = await AuthStorage.getFullName();
    final email = await AuthStorage.getEmail();
    if (mounted) {
      setState(() {
        _fullName  = name  ?? 'Driver';
        _email     = email ?? '';
        _isLoading = false;
      });
      _animController.forward();
    }
  }

  Future<void> _signOut() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF141836),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Sign Out',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
        content: const Text('Are you sure you want to sign out?',
            style: TextStyle(color: Color(0xFF8A94B4))),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel',
                style: TextStyle(color: Color(0xFF8A94B4))),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Sign Out',
                style: TextStyle(color: Color(0xFFFF5252),
                    fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await AuthStorage.clearSession();
      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => const SignInScreen(),
          transitionsBuilder: (_, anim, __, child) =>
              FadeTransition(opacity: anim, child: child),
          transitionDuration: const Duration(milliseconds: 400),
        ),
        (route) => false,
      );
    }
  }

  // ── UI ──────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0A0E27),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF4A90E2)),
        ),
      );
    }

    // Derive greeting time
    final hour = DateTime.now().hour;
    final greeting = hour < 12
        ? 'Good Morning'
        : hour < 17
            ? 'Good Afternoon'
            : 'Good Evening';

    // First-name only
    final firstName = _fullName.split(' ').first;

    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Hero header ────────────────────────────────
                _buildHeader(greeting, firstName),

                const SizedBox(height: 28),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // ── Status cards ────────────────────────
                      Row(
                        children: [
                          Expanded(
                            child: _InfoCard(
                              icon: Icons.email_outlined,
                              label: 'Email',
                              value: _email,
                              iconColor: const Color(0xFF4A90E2),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: _InfoCard(
                              icon: Icons.verified_user_outlined,
                              label: 'Account Status',
                              value: 'Verified',
                              iconColor: const Color(0xFF4CAF50),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 14),

                      // ── Quick action row ─────────────────────
                      _InfoCard(
                        icon: Icons.receipt_long_rounded,
                        label: 'Active Session',
                        value: 'JWT token stored securely',
                        iconColor: const Color(0xFF26C6DA),
                        fullWidth: true,
                      ),

                      const SizedBox(height: 32),

                      // ── Section title ────────────────────────
                      const Text(
                        'QUICK ACTIONS',
                        style: TextStyle(
                          color: Color(0xFF8A94B4),
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.6,
                        ),
                      ),
                      const SizedBox(height: 14),

                      // ── Primary CTA ──────────────────────────
                      _ActionCard(
                        icon: Icons.payment_rounded,
                        title: 'Pay Traffic Fine',
                        subtitle:
                            'Settle an outstanding fine securely via PayHere',
                        gradient: const [
                          Color(0xFF4A90E2),
                          Color(0xFF1565C0),
                        ],
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const PaymentFormScreen(),
                          ),
                        ),
                      ),

                      const SizedBox(height: 14),

                      // ── Info card ────────────────────────────
                      _ActionCard(
                        icon: Icons.history_rounded,
                        title: 'Payment History',
                        subtitle: 'View your past fine payments and status',
                        gradient: const [
                          Color(0xFF5C6BC0),
                          Color(0xFF283593),
                        ],
                        onTap: () => _showComingSoon(context),
                        isSecondary: true,
                      ),

                      const SizedBox(height: 14),

                      _ActionCard(
                        icon: Icons.notifications_outlined,
                        title: 'Fine Notifications',
                        subtitle:
                            'Check if any new fines have been issued to you',
                        gradient: const [
                          Color(0xFF26C6DA),
                          Color(0xFF006064),
                        ],
                        onTap: () => _showComingSoon(context),
                        isSecondary: true,
                      ),

                      const SizedBox(height: 36),

                      // ── Sign out ─────────────────────────────
                      OutlinedButton.icon(
                        onPressed: _signOut,
                        icon: const Icon(Icons.logout_rounded,
                            color: Color(0xFFFF5252), size: 18),
                        label: const Text('Sign Out',
                            style: TextStyle(
                                color: Color(0xFFFF5252),
                                fontWeight: FontWeight.w600)),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          side: const BorderSide(
                              color: Color(0xFFFF5252), width: 1.2),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                      ),

                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Header section with gradient background ─────────────────────

  Widget _buildHeader(String greeting, String firstName) {
    return Container(
      padding: const EdgeInsets.fromLTRB(22, 32, 22, 36),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0D1333), Color(0xFF141836)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Logo badge
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4A90E2), Color(0xFF1565C0)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF4A90E2).withOpacity(0.35),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.local_police_rounded,
                        color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Sri Lanka Police',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w700)),
                      Text('Traffic Fine Portal',
                          style: TextStyle(
                              color: Color(0xFF8A94B4), fontSize: 11)),
                    ],
                  ),
                ],
              ),

              // Notification bell placeholder
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF1F2547),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                      color: Colors.white.withOpacity(0.08)),
                ),
                child: const Icon(Icons.notifications_none_rounded,
                    color: Color(0xFF8A94B4), size: 22),
              ),
            ],
          ),

          const SizedBox(height: 36),

          // Avatar + greeting
          Row(
            children: [
              // Avatar circle
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFF4A90E2), Color(0xFF26C6DA)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Text(
                    firstName.isNotEmpty ? firstName[0].toUpperCase() : 'D',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w800),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$greeting,',
                      style: const TextStyle(
                          color: Color(0xFF8A94B4), fontSize: 14),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _fullName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Coming soon! 🚀',
            style: TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: const Color(0xFF141836),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }
}

// ── Widget: Info Card ───────────────────────────────────────────────────────

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.iconColor,
    this.fullWidth = false,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color iconColor;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF141836),
        borderRadius: BorderRadius.circular(16),
        border:
            Border.all(color: Colors.white.withOpacity(0.06), width: 1),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.14),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        color: Color(0xFF8A94B4),
                        fontSize: 11,
                        fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Widget: Action Card ─────────────────────────────────────────────────────

class _ActionCard extends StatelessWidget {
  const _ActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.gradient,
    required this.onTap,
    this.isSecondary = false,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final List<Color> gradient;
  final VoidCallback onTap;
  final bool isSecondary;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: isSecondary
              ? null
              : LinearGradient(
                  colors: gradient,
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
          color: isSecondary ? const Color(0xFF141836) : null,
          borderRadius: BorderRadius.circular(18),
          border: isSecondary
              ? Border.all(color: Colors.white.withOpacity(0.07), width: 1)
              : null,
          boxShadow: isSecondary
              ? null
              : [
                  BoxShadow(
                    color: gradient.first.withOpacity(0.35),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isSecondary
                    ? gradient.first.withOpacity(0.15)
                    : Colors.white.withOpacity(0.18),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon,
                  color: isSecondary ? gradient.first : Colors.white,
                  size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color:
                          isSecondary ? Colors.white : Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: isSecondary
                          ? const Color(0xFF8A94B4)
                          : Colors.white.withOpacity(0.75),
                      fontSize: 12,
                    ),
                    maxLines: 2,
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              size: 15,
              color:
                  isSecondary ? const Color(0xFF8A94B4) : Colors.white54,
            ),
          ],
        ),
      ),
    );
  }
}
