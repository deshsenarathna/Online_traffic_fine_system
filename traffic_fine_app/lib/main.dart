import 'package:flutter/material.dart';
import 'screens/payment_form_screen.dart';

void main() {
  runApp(const TrafficFineApp());
}

class TrafficFineApp extends StatelessWidget {
  const TrafficFineApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RideWave Fine Pay', 
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const PaymentFormScreen(), 
    );
  }
}