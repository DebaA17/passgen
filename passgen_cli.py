#!/usr/bin/env python3
"""
CLI Password Generator & Strength Checker

Usage:
  python passgen_cli.py generate [--length N] [--no-upper] [--no-lower] [--no-num] [--no-symbol]
  python passgen_cli.py check <password>

Examples:
  python passgen_cli.py generate --length 16 --no-symbol
  python passgen_cli.py check "MyPassword123!"
"""
import argparse
import random
import re
import sys

def check_strength(password):
    length = len(password)
    has_lower = bool(re.search(r"[a-z]", password))
    has_upper = bool(re.search(r"[A-Z]", password))
    has_num = bool(re.search(r"[0-9]", password))
    has_symbol = bool(re.search(r"[^A-Za-z0-9]", password))
    if length < 8 or (re.fullmatch(r"[A-Za-z]+", password) and length >= 8):
        return "Weak"
    if 8 <= length <= 12 and (has_num or has_symbol):
        return "Medium"
    if length > 12 and has_lower and has_upper and has_num and has_symbol:
        return "Strong"
    return "Medium"

def generate_password(length=12, upper=True, lower=True, num=True, symbol=True):
    upper_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lower_chars = "abcdefghijklmnopqrstuvwxyz"
    num_chars = "0123456789"
    symbol_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~"
    chars = ""
    if upper:
        chars += upper_chars
    if lower:
        chars += lower_chars
    if num:
        chars += num_chars
    if symbol:
        chars += symbol_chars
    if not chars:
        raise ValueError("No character sets selected!")
    pwd = ''.join(random.choice(chars) for _ in range(length))
    # Ensure at least one of each selected type
    arr = []
    if upper:
        arr.append(random.choice(upper_chars))
    if lower:
        arr.append(random.choice(lower_chars))
    if num:
        arr.append(random.choice(num_chars))
    if symbol:
        arr.append(random.choice(symbol_chars))
    pwd = ''.join(arr) + pwd[len(arr):]
    return pwd

def main():
    parser = argparse.ArgumentParser(description="Password Generator & Strength Checker CLI")
    subparsers = parser.add_subparsers(dest="command")

    gen_parser = subparsers.add_parser("generate", help="Generate a password")
    gen_parser.add_argument("--length", type=int, default=12, help="Password length (default 12)")
    gen_parser.add_argument("--no-upper", action="store_true", help="Exclude uppercase letters")
    gen_parser.add_argument("--no-lower", action="store_true", help="Exclude lowercase letters")
    gen_parser.add_argument("--no-num", action="store_true", help="Exclude numbers")
    gen_parser.add_argument("--no-symbol", action="store_true", help="Exclude special characters")

    check_parser = subparsers.add_parser("check", help="Check password strength")
    check_parser.add_argument("password", help="Password to check")

    args = parser.parse_args()
    if args.command == "generate":
        try:
            pwd = generate_password(
                length=args.length,
                upper=not args.no_upper,
                lower=not args.no_lower,
                num=not args.no_num,
                symbol=not args.no_symbol
            )
            print(f"Generated password: {pwd}")
            print(f"Strength: {check_strength(pwd)}")
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
    elif args.command == "check":
        strength = check_strength(args.password)
        print(f"Strength: {strength}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
