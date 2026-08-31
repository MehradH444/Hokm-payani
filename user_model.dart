class UserModel {
  final String id;
  final String displayName;
  final String? phoneNumber;
  final bool isGuest;
  final String avatar;
  final int coins;
  final int gems;
  final int level;
  final bool isVIP;
  final String equippedCardBack;
  final String equippedTableSkin;

  UserModel({
    required this.id,
    required this.displayName,
    this.phoneNumber,
    required this.isGuest,
    required this.avatar,
    required this.coins,
    required this.gems,
    required this.level,
    required this.isVIP,
    required this.equippedCardBack,
    required this.equippedTableSkin,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? '',
      displayName: json['displayName'] ?? 'بازیکن',
      phoneNumber: json['phoneNumber'],
      isGuest: json['isGuest'] ?? false,
      avatar: json['avatar'] ?? 'default_avatar.png',
      coins: json['coins'] ?? 0,
      gems: json['gems'] ?? 0,
      level: json['level'] ?? 1,
      isVIP: json['isVIP'] ?? false,
      equippedCardBack: json['equippedCardBack'] ?? 'classic',
      equippedTableSkin: json['equippedTableSkin'] ?? 'classic_green',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'displayName': displayName,
      'phoneNumber': phoneNumber,
      'isGuest': isGuest,
      'avatar': avatar,
      'coins': coins,
      'gems': gems,
      'level': level,
      'isVIP': isVIP,
      'equippedCardBack': equippedCardBack,
      'equippedTableSkin': equippedTableSkin,
    };
  }
}
