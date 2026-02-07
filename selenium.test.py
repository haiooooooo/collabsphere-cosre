from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, WebDriverException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Setup Chromium options for headless mode
chrome_options = Options()
chrome_options.binary_location = "/usr/bin/google-chrome"  # Update this path if necessary
chrome_options.add_argument("--headless")  # Run Chromium in headless mode
chrome_options.add_argument("--no-sandbox")  # Necessary for running as root
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
chrome_options.add_argument("--disable-gpu")  # Disable GPU hardware acceleration
chrome_options.add_argument("--remote-debugging-port=9222")  # Helps in remote environments

# Test function for login
def test_login(email, password, expected_success):
    print(f"Running login test with email: {email} and password: {password}...")

    # Initialize WebDriver with Chromium in headless mode
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=chrome_options)

    try:
        # Open the browser and navigate to the login page
        driver.get("http://localhost/#/login")  # Replace with your actual login URL
        driver.maximize_window()

        # Wait until the email field is visible
        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "email")))

        # Locate and fill in the email field
        email_field = driver.find_element(By.ID, "email")
        email_field.clear()
        email_field.send_keys(email)

        # Locate and fill in the password field
        password_field = driver.find_element(By.ID, "password")
        password_field.clear()
        password_field.send_keys(password)

        # Locate and click the login button
        login_button = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div/div[2]/div/div/form/button')
        login_button.click()

        # If expecting a successful login, wait for landing page
        if expected_success:
            WebDriverWait(driver, 10).until(EC.url_contains("/landingpage"))
            print("Login succeeded: Navigated to landing page.")
        else:
            # Wait for the alert to be visible if login fails
            alert_xpath = '//*[@id="root"]/div/div/div/div[2]/div/div/div/div[1]'
            try:
                WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, alert_xpath)))
                # Check if the error message is displayed
                error_message = driver.find_element(By.XPATH, alert_xpath).text
                if "Invalid Email Address or Password" in error_message:
                    print("Login failed: Invalid Email Address or Password alert displayed.")
                else:
                    print("Unexpected error message or login succeeded unexpectedly.")
            except TimeoutException:
                print("Timeout waiting for error message.")

    except (NoSuchElementException, WebDriverException, TimeoutException) as e:
        print(f"An error occurred during the login test: {e}")

    finally:
        print("Test completed.")
        driver.quit()

if __name__ == "__main__":
    # Test with correct credentials
    test_login("saksham@gmail.com", "saksham12345", expected_success=True)

    # Test with incorrect credentials
    test_login("invalid_email@example.com", "wrong_password", expected_success=False)
