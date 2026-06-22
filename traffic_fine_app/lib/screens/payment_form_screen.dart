import 'package:flutter/material.dart';
import 'package:payhere_mobilesdk_flutter/payhere_mobilesdk_flutter.dart';
import '../services/api_service.dart';

class PaymentFormScreen extends StatefulWidget {
  const PaymentFormScreen({Key? key}) : super(key: key);

  @override
  _PaymentFormScreenState createState() => _PaymentFormScreenState();
}

class _PaymentFormScreenState extends State<PaymentFormScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _refController = TextEditingController();
  final _badgeController = TextEditingController();
  final _nameController = TextEditingController();
  final _licenseController = TextEditingController();
  final _vehicleController = TextEditingController();
  final _otherCategoryController = TextEditingController();

  String _selectedPaymentMethod = 'CARD';
  String _selectedCategory = 'Speeding';
  bool _isLoading = false;

  final List<String> _offenseCategories = [
    'Speeding',
    'No Helmet',
    'Crossing Double White Line',
    'Drunk Driving',
    'Driving Without License',
    'Others'
  ];

  void _submitPayment() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      String finalCategory = _selectedCategory == 'Others' 
          ? _otherCategoryController.text.trim() 
          : _selectedCategory;

      try {
        final backendResponse = await ApiService.initiatePayment(
          referenceNumber: _refController.text.trim(),
          categoryCode: finalCategory,
          officerBadgeNumber: _badgeController.text.trim(),
          driverName: _nameController.text.trim(),
          driverLicenseNumber: _licenseController.text.trim(),
          vehicleNumber: _vehicleController.text.trim(),
          paymentMethod: _selectedPaymentMethod,
        );

        _startPayHereCheckout(backendResponse, _nameController.text.trim());
        
      } catch (e) {
        _showDialog('Error', 'Could not connect to the server. Check your connection.', Colors.redAccent);
        setState(() => _isLoading = false);
      }
    }
  }

  void _startPayHereCheckout(Map<String, dynamic> backendResponse, String driverName) {
    Map paymentObject = {
      "sandbox": true, 
      "merchant_id": "1223594", // PayHere Sandbox Merchant ID
      "merchant_secret": "",    
      "notify_url": "http://10.147.52.125:8080/api/payments/notify", 
      "order_id": backendResponse['paymentReference'] ?? "PAY-12345", 
      "items": "Traffic Fine Payment",
      "amount": backendResponse['amount'] != null ? backendResponse['amount'].toString() : "0.00",
      "currency": "LKR",
      "hash": backendResponse['hash'] ?? "", 
      "first_name": driverName,
      "last_name": "Driver",
      "email": "driver@example.com",
      "phone": "0771234567",
      "address": "Sri Lanka",
      "city": "Colombo",
      "country": "Sri Lanka",
    };

    PayHere.startPayment(
      paymentObject,
      (paymentId) {
        setState(() => _isLoading = false);
        _showDialog('Success', 'Payment Successful!\nTransaction ID: $paymentId\nSMS sent to the officer.', Colors.green);
        _formKey.currentState!.reset();
        _otherCategoryController.clear();
      },
      (error) {
        setState(() => _isLoading = false);
        _showDialog('Failed', 'Payment Failed. Try again.\nError: $error', Colors.redAccent);
      },
      () {
        setState(() => _isLoading = false);
        _showDialog('Cancelled', 'Payment was cancelled by the user.', Colors.orange);
      }
    );
  }

  void _showDialog(String title, String message, Color color) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Icon(
              title == 'Success' ? Icons.check_circle : (title == 'Failed' ? Icons.error : Icons.warning), 
              color: color,
            ),
            const SizedBox(width: 10),
            Text(title, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Text(message, style: const TextStyle(fontSize: 16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(), 
            child: const Text('OK', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))
          )
        ],
      ),
    );
  }

  // --- Custom UI Elements --- //

  InputDecoration _customInputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(color: Colors.grey.shade600),
      prefixIcon: Icon(icon, color: Colors.blueAccent.shade200),
      filled: true,
      fillColor: Colors.grey.shade50,
      contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: BorderSide(color: Colors.grey.shade300, width: 1.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: const BorderSide(color: Colors.blueAccent, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: const BorderSide(color: Colors.redAccent, width: 2),
      ),
    );
  }

  Widget _buildSectionCard({required String title, required IconData titleIcon, required List<Widget> children}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 25),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.15),
            spreadRadius: 2,
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(titleIcon, color: Colors.blueAccent, size: 28),
                const SizedBox(width: 10),
                Text(
                  title, 
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87),
                ),
              ],
            ),
            const SizedBox(height: 20),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        decoration: _customInputDecoration(label, icon),
        validator: (value) => value == null || value.isEmpty ? 'Please enter $label' : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100, // Background color
      appBar: AppBar(
        title: const Text('Pay Traffic Fine', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blueAccent,
        elevation: 0,
        centerTitle: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                
                // Fine Details Card
                _buildSectionCard(
                  title: 'Fine Details',
                  titleIcon: Icons.receipt_long,
                  children: [
                    _buildTextField(_refController, 'Reference Number', Icons.numbers),
                    _buildTextField(_badgeController, 'Officer Badge Number', Icons.local_police_outlined),
                    
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: DropdownButtonFormField<String>(
                        value: _selectedCategory,
                        icon: const Icon(Icons.keyboard_arrow_down, color: Colors.blueAccent),
                        decoration: _customInputDecoration('Offense Category', Icons.warning_amber_rounded),
                        items: _offenseCategories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                        onChanged: (val) => setState(() => _selectedCategory = val!),
                      ),
                    ),

                    if (_selectedCategory == 'Others')
                      _buildTextField(_otherCategoryController, 'Specify the offense', Icons.edit_note),
                  ],
                ),
                
                // Driver Details Card
                _buildSectionCard(
                  title: 'Driver Details',
                  titleIcon: Icons.drive_eta_rounded,
                  children: [
                    _buildTextField(_nameController, 'Driver Name', Icons.person_outline),
                    _buildTextField(_licenseController, 'License Number', Icons.card_membership),
                    _buildTextField(_vehicleController, 'Vehicle Number (e.g. WP CBA-1234)', Icons.directions_car_outlined),
                  ],
                ),

                // Payment Method Card
                _buildSectionCard(
                  title: 'Payment Method',
                  titleIcon: Icons.account_balance_wallet_outlined,
                  children: [
                    DropdownButtonFormField<String>(
                      value: _selectedPaymentMethod,
                      icon: const Icon(Icons.keyboard_arrow_down, color: Colors.blueAccent),
                      decoration: _customInputDecoration('Select Method', Icons.payment_outlined),
                      items: ['CARD', 'ONLINE_BANKING'].map((method) {
                        return DropdownMenuItem(value: method, child: Text(method));
                      }).toList(),
                      onChanged: (val) => setState(() => _selectedPaymentMethod = val!),
                    ),
                  ],
                ),
                
                const SizedBox(height: 10),
                
                // Fancy Submit Button
                Container(
                  height: 60,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(15),
                    gradient: const LinearGradient(
                      colors: [Colors.blueAccent, Colors.lightBlue],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blueAccent.withOpacity(0.4),
                        spreadRadius: 1,
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _submitPayment,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.lock_outline, color: Colors.white),
                              SizedBox(width: 10),
                              Text(
                                'Proceed to Secure Payment', 
                                style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1.2)
                              ),
                            ],
                          ),
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
}