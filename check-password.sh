#!/bin/bash

# Password Strength Checker for StatiCrypt
# This script helps evaluate password strength for the encrypted index.html

echo "================================================"
echo "Password Strength Checker for StatiCrypt"
echo "================================================"
echo ""
echo "IMPORTANT: This tool provides an ESTIMATE only."
echo "Actual security depends on many factors."
echo ""

# Function to estimate password cracking time
check_password_strength() {
    local password="$1"
    local length=${#password}
    
    echo "Password Analysis:"
    echo "- Length: $length characters"
    
    # Character set checks
    local has_lower=$(echo "$password" | grep -q '[a-z]' && echo "Yes" || echo "No")
    local has_upper=$(echo "$password" | grep -q '[A-Z]' && echo "Yes" || echo "No")
    local has_digit=$(echo "$password" | grep -q '[0-9]' && echo "Yes" || echo "No")
    local has_special=$(echo "$password" | grep -q '[^a-zA-Z0-9]' && echo "Yes" || echo "No")
    
    echo "- Lowercase letters: $has_lower"
    echo "- Uppercase letters: $has_upper"
    echo "- Digits: $has_digit"
    echo "- Special characters: $has_special"
    echo ""
    
    # Calculate charset size
    local charset=0
    [[ $has_lower == "Yes" ]] && charset=$((charset + 26))
    [[ $has_upper == "Yes" ]] && charset=$((charset + 26))
    [[ $has_digit == "Yes" ]] && charset=$((charset + 10))
    [[ $has_special == "Yes" ]] && charset=$((charset + 32))
    
    echo "Character set size: $charset"
    echo ""
    
    # Security rating
    local rating="VERY WEAK"
    local color="\033[0;31m" # Red
    
    if [ $length -ge 16 ] && [ $charset -ge 70 ]; then
        rating="STRONG"
        color="\033[0;32m" # Green
    elif [ $length -ge 14 ] && [ $charset -ge 62 ]; then
        rating="GOOD"
        color="\033[0;33m" # Yellow
    elif [ $length -ge 12 ] && [ $charset -ge 36 ]; then
        rating="FAIR"
        color="\033[0;33m" # Yellow
    elif [ $length -ge 10 ] && [ $charset -ge 26 ]; then
        rating="WEAK"
        color="\033[0;31m" # Red
    fi
    
    echo -e "Security Rating: ${color}${rating}\033[0m"
    echo ""
    
    # Recommendations
    echo "Recommendations:"
    if [ $length -lt 16 ]; then
        echo "- ⚠️  Increase length to at least 16 characters"
    fi
    if [ "$has_lower" == "No" ] || [ "$has_upper" == "No" ]; then
        echo "- ⚠️  Use both lowercase and uppercase letters"
    fi
    if [ "$has_digit" == "No" ]; then
        echo "- ⚠️  Include at least one digit"
    fi
    if [ "$has_special" == "No" ]; then
        echo "- ⚠️  Include at least one special character"
    fi
    
    if [ "$rating" == "STRONG" ]; then
        echo "- ✅ Password meets security recommendations!"
    fi
    echo ""
}

# Main script
echo "Choose an option:"
echo "1. Test a password"
echo "2. Generate a strong password"
echo "3. Show password requirements"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        read -sp "Enter password to test (it won't be stored): " password
        echo ""
        echo ""
        check_password_strength "$password"
        ;;
    2)
        echo ""
        echo "Generating a strong random password..."
        if command -v openssl &> /dev/null; then
            password=$(openssl rand -base64 24)
            echo "Generated password: $password"
            echo ""
            echo "IMPORTANT: Save this password in a secure location!"
            echo "Consider using a password manager like 1Password, Bitwarden, or KeePass."
        else
            echo "ERROR: openssl not found. Please install openssl."
            echo ""
            echo "Alternatively, use an online password generator:"
            echo "- https://www.lastpass.com/features/password-generator"
            echo "- https://bitwarden.com/password-generator/"
        fi
        echo ""
        ;;
    3)
        echo ""
        echo "StatiCrypt Password Requirements:"
        echo "=================================="
        echo ""
        echo "MINIMUM REQUIREMENTS:"
        echo "- At least 16 characters long"
        echo "- Mix of uppercase and lowercase letters"
        echo "- At least one digit (0-9)"
        echo "- At least one special character (!@#$%^&*)"
        echo "- NOT a dictionary word or common phrase"
        echo "- NOT used on other websites/services"
        echo ""
        echo "WHY STRONG PASSWORDS MATTER:"
        echo "- The encrypted content can be attacked offline"
        echo "- Weak passwords can be cracked in hours or days"
        echo "- Strong passwords make cracking practically impossible"
        echo ""
        echo "BEST PRACTICE:"
        echo "- Use a password manager to generate and store passwords"
        echo "- Use unique passwords for each application"
        echo "- Consider changing passwords periodically for sensitive data"
        echo ""
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "================================================"
echo "For more information, see SECURITY.md"
echo "================================================"
