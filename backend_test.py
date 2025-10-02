#!/usr/bin/env python3
"""
Mr. Sigmar Services Backend API Testing
Tests all backend endpoints for functionality, Portuguese content, and MongoDB integration
"""

import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
print(f"Testing backend at: {BACKEND_URL}")

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'healthy':
                print("✅ Health check passed")
                return True
            else:
                print("❌ Health check failed - incorrect status")
                return False
        else:
            print(f"❌ Health check failed - status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed - error: {e}")
        return False

def test_services_api():
    """Test the services endpoint for Portuguese content"""
    print("\n=== Testing Services API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/api/services", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            services = response.json()
            print(f"Number of services: {len(services)}")
            
            # Check if services are in Portuguese
            portuguese_keywords = ['Instalação', 'Manutenção', 'Reparo', 'Elétrico', 'Geladeira']
            portuguese_found = False
            
            for service in services:
                print(f"Service: {service.get('title', 'N/A')}")
                for keyword in portuguese_keywords:
                    if keyword in service.get('title', '') or keyword in service.get('description', ''):
                        portuguese_found = True
                        break
            
            if portuguese_found and len(services) >= 5:
                print("✅ Services API passed - Portuguese content verified")
                return True
            else:
                print("❌ Services API failed - Portuguese content or service count issue")
                return False
        else:
            print(f"❌ Services API failed - status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Services API failed - error: {e}")
        return False

def test_testimonials_get():
    """Test the testimonials GET endpoint"""
    print("\n=== Testing Testimonials GET API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/api/testimonials", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            testimonials = response.json()
            print(f"Number of testimonials: {len(testimonials)}")
            
            # Check for Portuguese content in testimonials
            portuguese_names = ['Maria', 'João', 'Ana']
            portuguese_found = False
            
            for testimonial in testimonials:
                print(f"Testimonial by: {testimonial.get('name', 'N/A')}")
                if any(name in testimonial.get('name', '') for name in portuguese_names):
                    portuguese_found = True
            
            if portuguese_found and len(testimonials) >= 3:
                print("✅ Testimonials GET API passed - Portuguese sample data verified")
                return True
            else:
                print("❌ Testimonials GET API failed - Portuguese content issue")
                return False
        else:
            print(f"❌ Testimonials GET API failed - status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Testimonials GET API failed - error: {e}")
        return False

def test_contact_form_post():
    """Test the contact form POST endpoint"""
    print("\n=== Testing Contact Form POST API ===")
    
    # Test data with realistic Brazilian names and info
    contact_data = {
        "name": "Carlos Mendes",
        "email": "carlos.mendes@email.com",
        "phone": "(67) 99999-8888",
        "service": "Instalação de Ar Condicionado",
        "message": "Preciso instalar um ar condicionado split na minha sala. Quando vocês podem vir fazer um orçamento?"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True:
                print("✅ Contact form POST API passed")
                return True
            else:
                print("❌ Contact form POST API failed - success flag not true")
                return False
        else:
            print(f"❌ Contact form POST API failed - status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Contact form POST API failed - error: {e}")
        return False

def test_contact_form_validation():
    """Test contact form validation with missing fields"""
    print("\n=== Testing Contact Form Validation ===")
    
    # Test with missing required field
    invalid_data = {
        "name": "Test User",
        "email": "test@email.com"
        # Missing phone, service, message
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/contact",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 422:  # Validation error expected
            print("✅ Contact form validation working correctly")
            return True
        else:
            print(f"❌ Contact form validation failed - expected 422, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Contact form validation test failed - error: {e}")
        return False

def test_testimonials_post():
    """Test the testimonials POST endpoint"""
    print("\n=== Testing Testimonials POST API ===")
    
    # Test data with realistic Brazilian testimonial
    testimonial_data = {
        "name": "Roberto Silva",
        "rating": 5,
        "comment": "Serviço excelente! O Sr. Sigmar consertou minha geladeira muito rapidamente e com preço justo. Recomendo!",
        "service": "Reparo de Geladeira"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/testimonials",
            json=testimonial_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True:
                print("✅ Testimonials POST API passed")
                return True
            else:
                print("❌ Testimonials POST API failed - success flag not true")
                return False
        else:
            print(f"❌ Testimonials POST API failed - status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Testimonials POST API failed - error: {e}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 Starting Mr. Sigmar Services Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    results = {
        'health_check': test_health_check(),
        'services_api': test_services_api(),
        'testimonials_get': test_testimonials_get(),
        'contact_form_post': test_contact_form_post(),
        'contact_form_validation': test_contact_form_validation(),
        'testimonials_post': test_testimonials_post()
    }
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend API is working correctly.")
    else:
        print(f"⚠️  {total - passed} test(s) failed. Please check the issues above.")
    
    return results

if __name__ == "__main__":
    run_all_tests()