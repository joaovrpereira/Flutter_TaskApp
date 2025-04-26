import 'package:flutter/material.dart';
import 'package:frontend/features/auth/pages/signup_dart.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  static route() => MaterialPageRoute(builder: (context) => const LoginPage());

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final formKey = GlobalKey<FormState>(); //State associated with Form Widget

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    formKey.currentState!.validate();
    super.dispose();
  }

  void loginUser() {
    if (formKey.currentState!.validate()) {
      // store the user data
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "Login.",
                style: TextStyle(fontSize: 50, fontWeight: FontWeight.bold),
              ),

              const SizedBox(height: 15),
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(hintText: "Email"),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return "Email field cannot be empty.";
                  }
                  // Expressão regular simples para validar email
                  final emailRegex = RegExp(
                    r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                  );
                  if (!emailRegex.hasMatch(value)) {
                    return "Enter a valid email address.";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 15),
              TextFormField(
                controller: passwordController,
                decoration: const InputDecoration(hintText: "Password"),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return "Password field cannot be empty.";
                  }
                  if (value.trim().length < 6) {
                    return "Password must have at least 6 characters.";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 15),
              ElevatedButton(
                onPressed: loginUser,
                child: const Text(
                  "LOGIN",
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
              const SizedBox(height: 15),
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(SignupPage.route());
                },
                child: RichText(
                  text: TextSpan(
                    text: 'Doesn\'t have an account? ',
                    style: Theme.of(context).textTheme.titleMedium,
                    children: [
                      TextSpan(
                        text: 'Sign Up',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
