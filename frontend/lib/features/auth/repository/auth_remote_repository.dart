import 'dart:convert';

import 'package:frontend/core/constants/constants.dart';
import 'package:frontend/model/user_model.dart';
import 'package:http/http.dart' as http;

class AuthRemoteRepository {
  Future<UserModel> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final res = await http.post(
        Uri.parse("${Constants.backendUri}/auth/signup"),
        headers: {'Content-type': 'application/json'},
      );

      if (res.statusCode != 201) {
        throw jsonDecode(res.body)["msg"];
      }

      return UserModel.fromJson(res.body);
    } catch (err) {
      throw err.toString();
    }
  }

  //Future<void> login({required String email, required String password}) {}
}
