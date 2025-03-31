from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
from faker import Faker
from random import randint
from sympy import isprime, mod_inverse
app = Flask(__name__)
fake = Faker(['en_US'])
CORS(app, supports_credentials=True,origins=["http://localhost:5555"],)  # Enable CORS for all routes automatically

# Sample leaderboard and active challenges
leaderboard = []
activeChallenges = []
def caesar_cipher(text: str) -> str:
    result = ""
    shift_amount = randint(1,25)
    for char in text:
        if char.isalpha():
            new_char = chr(((ord(char.lower()) - ord('a') + shift_amount) % 26) + ord('a'))
            result += new_char.upper() if char.isupper() else new_char
        else:
            result += char
    return result

def vigenere_cipher(text: str, key: str) -> str:
    result = []
    key_length = len(key)
    key_as_int = [ord(i) for i in key.lower()]  # Ensure the key is in lowercase for uniformity
    text_as_int = [ord(i) for i in text]
    
    for i in range(len(text_as_int)):
        if text[i].isalpha():
            # Shift only alphabetic characters
            shift = key_as_int[i % key_length] - ord('a')  # Ensure we only use the alphabet
            if text[i].isupper():
                # Uppercase letters, shifting within uppercase range
                value = (text_as_int[i] - ord('A') + shift) % 26 + ord('A')
            else:
                # Lowercase letters, shifting within lowercase range
                value = (text_as_int[i] - ord('a') + shift) % 26 + ord('a')
            result.append(chr(value))
        else:
            # Non-alphabetic characters are added as is
            result.append(text[i])
    
    return ''.join(result)

def generate_large_prime():
    prime = randint(2, 200)
    while not isprime(prime):
        prime = randint(2, 200)
    return prime

# Generate RSA keys with provided primes
def generate_rsa_keys():
    # Step 1: Generate two large prime numbers
    p = generate_large_prime()
    q = generate_large_prime()
    while p == q:  # Ensure the primes are not equal
        q = generate_large_prime()

    # Step 2: Compute n = p * q (the modulus)
    n = p * q
    
    # Step 3: Compute Euler's Totient: φ(n) = (p-1) * (q-1)
    phi_n = (p - 1) * (q - 1)
    
    # Step 4: Choose public exponent e (you wanted 43)
    e = 43
    
    # Step 5: Compute the private exponent d such that d * e ≡ 1 (mod φ(n))
    d = mod_inverse(e, phi_n)

    # Public key: (n, e)
    # Private key: (n, d)
    return p, q, n, e, d

# Encrypt a message with the public key (n, e)
def encrypt_message(n, e, message):
    # Convert the message to a list of integers based on ASCII values
    message_int = [ord(char) for char in message]
    message = [pow(char, e, n) for char in message_int]
    encrypted_message = ''.join([str(char)+" " for char in message])  
    return encrypted_message

# Decrypt the message with the private key (n, d)
def decrypt_message(n, d, encrypted_message):
    decrypted_message = ''.join([chr(pow(char, d, n)) for char in encrypted_message])
    return decrypted_message
    

@app.route("/leaderboard", methods=["GET", "POST"])
@cross_origin()  # Optional if global CORS is working
def leaderboard_handler():
    if request.method == "GET":
        # Sort leaderboard by points in descending order
        return jsonify(sorted(leaderboard, key=lambda p: p["points"], reverse=True))
    
    if request.method == "POST":
        name = request.json["name"]
        if any(p["name"] == name for p in leaderboard):
            return jsonify({"error": "Player already exists"}), 400
        leaderboard.append({"name": name, "points": 0})  # Initialize with 0 points and no challenges
        print(f"New player added: {name}")
        return jsonify({"message": "success"})
    

@app.route("/challenge/<difficulty>", methods=["GET"])
@cross_origin()  # Ensure CORS is enabled on this route
def get_challenge(difficulty):
    phrase = fake.city() # Static phrase for now
    challenge = {}
    prompt = ""
    idNumber = len(activeChallenges) + 1  # Unique ID for each challenge
    if difficulty == "easy":
        code = caesar_cipher(phrase)
        challenge = {"id": idNumber, "solution": phrase, "points": 1}
        prompt = f"Decode: '{code}'."
    elif difficulty == "medium":
        phrase = fake.sentence(nb_words=3)[:-1]
        key = fake.word()
        code = vigenere_cipher(phrase, key)
        challenge = {"id": idNumber, "solution": phrase, "points": 2}
        prompt = f"Use the key '{key}' to decode '{code}'."
    elif difficulty == "hard":
        phrase = fake.word()
        p, q, n, e, d = generate_rsa_keys()
        # Encrypt the phrase using RSA
        code = encrypt_message(n, e, phrase)
        challenge = {"id": idNumber, "solution": phrase, "points": 3}
        prompt = f"Given p='{p}', q='{q}', and e='{e}', decode '{code}'."
    activeChallenges.append(challenge)
    print(activeChallenges)
    return jsonify({"id": idNumber, "challenge": prompt})

@app.route("/challenge/<int:id>", methods=["POST", "OPTIONS"])
@cross_origin()  # Ensure CORS is enabled on this route
def submit_solution(id):
    if request.method == "POST":
        data = request.json
        print(activeChallenges)
        for challenge in activeChallenges:
            if challenge["id"] == id:
                if data["answer"].lower() == challenge["solution"].lower():
                    name = data["name"]
                    points = challenge["points"]
                    # Check if player exists in leaderboard
                    player = next((p for p in leaderboard if p["name"] == name), None)
                    if player is None:
                        print(f"Player {name} not found in leaderboard.")
                        return jsonify({"error": "Player not found"}), 404
                    # Update player's points
                    player["points"] += points
                    print(f"Player {name} solved challenge {id} and earned {points} points.")
                    return jsonify({"status": "correct"})
                else:
                    return jsonify({"error": "Incorrect solution"}), 400
        return jsonify({"error": "Challenge not found"}), 404
    if request.method == "OPTIONS":
        return jsonify({'message': 'OPTIONS allowed'}), 200

if __name__ == "__main__":
    app.run(port=5555, debug=True)