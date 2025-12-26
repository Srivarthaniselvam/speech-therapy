from flask import Flask, render_template, request, jsonify, redirect, url_for
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase.client import ClientOptions

# --------------------------------------------------
# Path setup
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)

# --------------------------------------------------
# Load environment variables
# --------------------------------------------------
load_dotenv(dotenv_path='supabase.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials not found in supabase.env")

# --------------------------------------------------
# Supabase client
# --------------------------------------------------
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
    options=ClientOptions(
        postgrest_client_timeout=10,
        storage_client_timeout=10,
        schema="public",
    )
)

# --------------------------------------------------
# Flask app
# --------------------------------------------------
app = Flask(
    __name__,
    static_folder='../static',
    template_folder='../template'
)

app.secret_key = "secret123"

# --------------------------------------------------
# DEMO USERS (HARDCODED LOGIN)
# --------------------------------------------------
USERS = {
    "admin": {
        "password": "admin123",
        "role": "supervisor"
    },
    "therapist": {
        "password": "therapy123",
        "role": "therapist"
    },
    "userpatient": {
        "password": "user123",
        "role": "patient"
    }
}

# --------------------------------------------------
# API ROUTES
# --------------------------------------------------
@app.route('/add-item', methods=['POST'])
def add_item():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    response = supabase.table('inventory').insert(data).execute()

    if response.error:
        return jsonify({"error": response.error.message}), 400

    return jsonify({"message": "Item added successfully!"}), 200

# --------------------------------------------------
# PAGE ROUTES
# --------------------------------------------------
@app.route('/')
def landing():
    return render_template('index.html')

# 🔐 LOGIN
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        # role is a string like "1","2","3" based on radio
        selected_role_value = request.form.get('role')

        user = USERS.get(username)

        if not user or user['password'] != password:
            error = "Invalid username or password"
        else:
            # Map radio value -> role
            value_to_role = {
                "1": "supervisor",
                "2": "therapist",
                "3": "patient"
            }
            selected_role = value_to_role.get(selected_role_value)

            if selected_role is None:
                error = "Please select a role"
            elif selected_role != user['role']:
                # Example: username 'admin' but user selected 'patient'
                error = "Selected role does not match this user"
            else:
                # Role matches -> redirect to corresponding profile page
                if selected_role == 'supervisor':
                    return redirect(url_for('supervisor_dashboard'))
                elif selected_role == 'therapist':
                    return redirect(url_for('therapist_dashboard'))
                elif selected_role == 'patient':
                    return redirect(url_for('patient_dashboard'))

    return render_template('login.html', error=error)

# 🧾 SIGNUP (demo – just redirects to login)
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # TODO: insert into Supabase / DB
        return redirect(url_for('login'))
    return render_template('signup-page.html')

# --------------------------------------------------
# LEGACY / GENERAL PAGES
# --------------------------------------------------
@app.route('/profile')
def profile():
    return render_template('Profile-patient.html')

@app.route('/inventory')
def inventory():
    return render_template('inventory.html')

@app.route('/bill')
def bill():
    return render_template('bill.html')

@app.route('/checkout')
def checkout():
    return render_template('checkout.html')

@app.route('/purchase-order')
def purchase_order():
    return render_template('purchase-order.html')

@app.route('/sales-report')
def sales_report():
    return render_template('sales-report.html')

@app.route('/distributor')
def distributor():
    return render_template('distributor.html')

# --------------------------------------------------
# ROLE DASHBOARDS -> EXISTING PROFILE TEMPLATES
# --------------------------------------------------
@app.route('/supervisor-dashboard')
def supervisor_dashboard():
    # exact file name in /template
    return render_template('Profile-supervisro.html')

@app.route('/therapist-dashboard')
def therapist_dashboard():
    return render_template('Profile-therapist.html')

@app.route('/patient-dashboard')
def patient_dashboard():
    return render_template('Profile-patient.html')

# --------------------------------------------------
# PATIENT ROUTES
# (used instead of requesting *.html directly)
# --------------------------------------------------
@app.route('/patient/profile')
def patient_profile():
    return render_template('Profile-patient.html')

@app.route('/patient/appointments')
def patient_appointments():
    return render_template('appointments-patient.html')

@app.route('/patient/reports')
def patient_reports():
    return render_template('reports-patient.html')

@app.route('/patient/exercises')
def patient_exercises():
    return render_template('exercises_patient.html')

@app.route('/patient/find-therapist')
def patient_find_therapist():
    return render_template('find-therapist.html')

# --------------------------------------------------
# THERAPIST ROUTES
# --------------------------------------------------
@app.route('/therapist/profile')
def therapist_profile():
    return render_template('Profile-therapist.html')

@app.route('/therapist/appointments')
def therapist_appointments():
    return render_template('appointments-therapist.html')

@app.route('/therapist/reports')
def therapist_reports():
    return render_template('reports-therapist.html')

@app.route('/therapist/exercises')
def therapist_exercises():
    return render_template('exercises_therapist.html')

# --------------------------------------------------
# SUPERVISOR ROUTES
# --------------------------------------------------
@app.route('/supervisor/profile')
def supervisor_profile():
    return render_template('Profile-supervisro.html')

@app.route('/supervisor/therapists')
def list_therapists():
    return render_template('list-of-therapists.html')

@app.route('/supervisor/reports')
def supervisor_reports():
    return render_template('report-supervisor.html')

# --------------------------------------------------
# MOBILE PAGES
# --------------------------------------------------
@app.route('/bill-m')
def bill_m():
    return render_template('bill_m.html')

@app.route('/index-m')
def index_m():
    return render_template('index_m.html')

@app.route('/inventory-m')
def inventory_m():
    return render_template('inventory_m.html')

@app.route('/profile-m')
def profile_m():
    return render_template('profile_m.html')

@app.route('/sales-report-m')
def sales_report_m():
    return render_template('sales-report_m.html')

@app.route('/purchase-order-m')
def purchase_order_m():
    return render_template('purchase-order_m.html')
@app.route('/feedback')
def feedback():
    return render_template('feedback.html')

# --------------------------------------------------
# Run server
# --------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=3000)
