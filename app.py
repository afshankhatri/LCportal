from flask import Flask,render_template,request,flash,redirect,url_for,session,jsonify;
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from datetime import datetime
import pymysql
from werkzeug.security import check_password_hash
import smtplib
from email.mime.text import MIMEText
from flask import Flask
from flask_mail import Mail, Message

pymysql.install_as_MySQLdb()

app = Flask(__name__)
app.secret_key = "123456789"
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:root123@localhost/LCsystem"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ------------------------------ TABLE CLASS DECLARATION ------------------------------
 

# general user
class User(db.Model): # .......    user here is the name of the table  ..  given beow are the names and property of the Column
    name = db.Column(db.String(250), nullable=False)
    email = db.Column(db.String(120), primary_key=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # New column
    user_type = db.Column(db.Integer, nullable=False)  # New column
    phone_no = db.Column(db.String(255), nullable=False)
    dept = db.Column(db.Integer, nullable=False)
    date_created = db.Column(db.DateTime, default = datetime.utcnow)   # ... to get DateTime we need to import a file called (from datetime import datetime)
    def __repr__(self) :
        return f"{self.name, self.email, self.password, self.user_type, self.phone_no, self.dept}"


# students
class Student(db.Model): 
    __tablename__ = 'student'  # Explicit table name

    sr_no = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Auto-increment primary key
    user_id = db.Column(db.String(120), db.ForeignKey('user.email', ondelete='CASCADE'), nullable=False)  # Foreign key linking to User(email)
    GR_no = db.Column(db.String(100), nullable=True)  # Nullable unique identifier
    yearOfJoin = db.Column(db.Integer, nullable=True)  # YEAR type stored as an Integer
    courseName = db.Column(db.Integer, nullable=True)
    reasonOfLeaving = db.Column(db.String(255), nullable=True)
    PRN = db.Column(db.String(255), nullable=True)
    UPRN = db.Column(db.String(255), nullable=True)
    isSubmitted = db.Column(db.Integer, nullable=True, default=0)  # Default 0
    semester = db.Column(db.Integer, nullable=True)
    lastLogin = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp with default current time
    finalYearMarksheet = db.Column(db.String(255), nullable=True)
    declaration = db.Column(db.Integer, nullable=True, default=0)  # Default 0
    hod_approval_status = db.Column(db.Integer, nullable=True, default=0)  # Add this column
    lib_approval_status = db.Column(db.Integer, nullable=True, default=0)  # Add this column
    acc_approval_status = db.Column(db.Integer, nullable=True, default=0)  # Add this column
    hod_rejection_reason = db.Column(db.String(255), nullable=True)
    hod_remarks = db.Column(db.Text, nullable=True)
    acc_remarks = db.Column(db.Text, nullable=True)
    acc_rejection_reason = db.Column(db.String(255), nullable=True)
    lib_remarks = db.Column(db.Text, nullable=True)
    lib_rejection_reason = db.Column(db.String(255), nullable=True)
    LCgenerated = db.Column(db.Integer, nullable=True, default=0)


    # Relationship with User table
    user = db.relationship('User', backref=db.backref('students', lazy=True))  # Establishing relationship

    def __repr__(self):
        return f"{ self.sr_no, self.user_id , self.GR_no , self.yearOfJoin , self.courseName , self.reasonOfLeaving , self.PRN , self.UPRN , self.isSubmitted , self.semester , self.lastLogin , self.finalYearMarksheet , self.declaration }"
    
    
class HOD(db.Model):
    __tablename__ = 'hod'  # Explicit table name

    id_hod = db.Column(db.String(120), db.ForeignKey('user.email', ondelete='CASCADE'), primary_key=True)  # Primary key, FK to User(email)
    name = db.Column(db.String(255))  # HOD's name
    emp_id = db.Column(db.String(100),  unique=True)  # Unique Employee ID
    dept = db.Column(db.Integer, )  # Department Name
    remarks = db.Column(db.Text, nullable=True)  # General Remarks
    misconduct_flag = db.Column(db.Integer, nullable=True, default=0)  # Flag indicating misconduct
    achievements_flag = db.Column(db.Integer, nullable=True, default=0)  # Flag indicating achievements
    rejection_reason = db.Column(db.String(255), nullable=True)  # Reason for rejection (if any)
    approval_status = db.Column(db.Integer, nullable=True, default=0)  # Status of approval
    last_verification_date = db.Column(db.Date, nullable=True)  # Last verification date
    # date_of_joining = db.Column(db.DateTime, nullable=True)  # Date of joining
    # contact_number = db.Column(db.String(15), nullable=True)  # Contact number
    # designation = db.Column(db.String(255), nullable=True)  # HOD Designation
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())  # Last updated timestamp

    def __repr__(self):
        return f"{ self.id_hod , self.name , self.emp_id , self.dept , self.remarks , self.misconduct_flag , self.achievements_flag , self.rejection_reason , self.approval_status , self.last_verification_date  }"
    
# ------------------------------- FUNCTION DEFINATIONS -------------------------------

@app.route("/registration", methods = ['GET','POST'])
def registration():
    if request.method == 'POST':
        # print(request.form)
        name = request.form['name']
        email = request.form['email']
        user_type = int(request.form['user_type'])  # Convert to int
        password = request.form['password']
        phone_no = request.form['phone_no']
        dept = request.form['dept']
        
        userInfo = User(name = name , email = email,user_type = user_type , password = password, phone_no=phone_no,dept=dept)
        db.session.add(userInfo)
        db.session.commit()
        return redirect(url_for('signin'))
        
    return render_template("User/registration.html")


@app.route("/signin", methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email,password=password).first()
        if user:
            # Store user data in session
            # session["user_id"] = user.id          # or user.sr_no / primary key
            session["user_email"] = user.email
            session["user_type"] = user.user_type
            session["user_dept"] = user.dept

            # Redirect based on user_type
            if user.user_type == 0:
                return redirect(url_for("studentlanding"))
            elif user.user_type == 1:
                return redirect(url_for("adminlanding"))
            elif user.user_type == 2:
                return redirect(url_for("hodlanding"))
            elif user.user_type == 3:
                return redirect(url_for("librarianlanding"))
            elif user.user_type == 4:
                return redirect(url_for("accountslanding"))
            elif user.user_type == 5:
                return redirect(url_for("lCgeneratorlanding"))
        else:
            return "Invalid credentials", 401
        # if user.user_type == 0:
        #     return redirect(url_for("studentlanding"))
        # elif user.user_type == 1:
        #     return redirect(url_for("adminlanding"))
        # elif user.user_type == 2:
        #     return redirect(url_for("hodlanding"))
        # elif user.user_type == 3:
        #     return redirect(url_for("librarianlanding"))
        # elif user.user_type == 4:
        #     return redirect(url_for("accountslanding"))
        # elif user.user_type == 5:
        #     return redirect(url_for("lCgeneratorlanding"))            

    return render_template("User/signIn.html")


@app.route("/logout") # make a button for this and then leave it to this page ,it will logout the session
def logout():
    session.clear()
    return redirect(url_for('signin'))


@app.route("/error") 
def err():
    return render_template("User/error.html")


@app.route("/studentPage",methods=['GET', 'POST'])
def studentlanding():
    if session.get("user_email") and session.get("user_type") == 0:
        
        user_id = session.get("user_email")
        application = Student.query.filter_by(user_id=user_id).first()
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        return render_template("students/landingStud.html",application=application)
    else:
        return redirect(url_for('err'))
 
@app.route("/apply",methods=['GET', 'POST'])
def studentapply():
    
    if session.get("user_email") and session.get("user_type") == 0:
        
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        user_id = session.get("user_email")
        
        
        if request.method == 'POST':
            # print(request.form)
            # user_id = request.form['user_id']
            GR_no = request.form['GR_no']
            yearOfJoin = request.form['yearOfJoin']
            # courseName = request.form['courseName']  
            reasonOfLeaving = request.form['reasonOfLeaving']
            PRN = request.form['PRN']
            UPRN = request.form['UPRN']
            semester = request.form['semester']
            # declaration = request.form['declaration']
            # isSubmitted= request.form["isSubmitted"]
            
            # Get the checkbox value, default to '0' if unchecked
            declaration = request.form.get('declaration', '0')
            # Submit button is always clicked, so store '1'
            isSubmitted = request.form.get('isSubmitted', '1')
            
            # application = Student(GR_no = GR_no , yearOfJoin = yearOfJoin , courseName = courseName , reasonOfLeaving = reasonOfLeaving , PRN=PRN , UPRN=UPRN , semester=semester , declaration=declaration , isSubmitted=isSubmitted)
            application = Student.query.filter_by(user_id=user_id).first()
            # db.session.add(application)
            # db.session.commit()
            # return redirect(url_for('studentlanding'))
            if application:
                # Update existing record
                application.GR_no = GR_no
                application.yearOfJoin = yearOfJoin
                # application.courseName = courseName
                application.reasonOfLeaving = reasonOfLeaving
                application.PRN = PRN
                application.UPRN = UPRN
                application.semester = semester
                application.declaration = declaration
                application.isSubmitted = isSubmitted
            else:
                return "Student record not found!", 404  # If no record exists, return error

            db.session.commit()  # Save changes to DB
            return redirect(url_for('studentlanding'))
        return render_template("students/applicationForm.html")
    else:
        return redirect(url_for('err'))



@app.route("/adminsPage")
def adminlanding():
    if session.get("user_email") and session.get("user_type") == 1:
        print( f"Welcome, {session['user_email']} (You are an: {session['user_type']})")
        return render_template("admin/landingAdmin.html")
    else:
        return redirect(url_for('err'))




@app.route("/hodPage",methods=['GET', 'POST'])
def hodlanding():
    if session.get("user_email") and session.get("user_type") == 2:
        
        print( f"Welcome, {session['user_email']} (You are an: {session['user_type']} . of dept {session["user_dept"]})")

        # with the filter given below the hod will now be able to see the studets of only his branch ... hod table me koi bhi student ka masla hua to sidha ye wale code ko aa k check kar na 
        studentDetails = Student.query.filter(
            and_(
                Student.isSubmitted == 1,
                Student.courseName == session["user_dept"]
            )
        ).all()        
        return render_template("HODs/landingHod.html", studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/HODacceptedForms")
def HODacceptedForm(): 
    
    if session.get("user_email") and session.get("user_type") == 2:
        
        print( f"Welcome, {session['user_email']} (You are an: {session['user_type']})")
        studentDetails = Student.query.filter_by(hod_approval_status=1).all()
        
        return render_template("HODs/HODacceptedForms.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/HODrejectedForms")
def HODrejectedForm():
    if session.get("user_email") and session.get("user_type") == 2:
        
        print( f"Welcome, {session['user_email']} (You are an: {session['user_type']})")
        studentDetails = Student.query.filter_by(hod_approval_status=2).all()
        
        return render_template("HODs/HODrejectedForms.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))



@app.route("/librarianPage",methods=['GET', 'POST'])
def librarianlanding():
    if session.get("user_email") and session.get("user_type") == 3:
        
        print( f"Welcome, {session['user_email']} (You are an: {session['user_type']})")
        studentDetails = Student.query.filter_by(isSubmitted=1).all()
        
        return render_template("librarian/landingLibrary.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/librarianAcceptedForms")
def librarianAcceptedForm():
    if session.get("user_email") and session.get("user_type") == 3:
        
        studentDetails = Student.query.filter_by(lib_approval_status=1).all()
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        
        return render_template("librarian/librarianAcceptedForms.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/librarianRejectedForms")
def librarianRejectedForm():
    
    if session.get("user_email") and session.get("user_type") == 3:
        
        studentDetails = Student.query.filter_by(lib_approval_status=2).all()
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        
        return render_template("librarian/librarianRejectedForms.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))




@app.route("/accountsPage",methods=['GET', 'POST'])
def accountslanding():
    
    if session.get("user_email") and session.get("user_type") == 4:
        
        studentDetails = Student.query.filter_by(isSubmitted=1).all()
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        
        return render_template("Accounts/landingAccounts.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/AccountsRejectedForms")
def AccountsRejectedForm():
    
    if session.get("user_email") and session.get("user_type") == 4:
        
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        studentDetails = Student.query.filter_by(acc_approval_status=2).all()
                
        return render_template("Accounts/AccRejectedForms.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/AccountsAcceptedForms")
def AccountsAcceptedForm():
    if session.get("user_email") and session.get("user_type") == 4:
        
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        studentDetails = Student.query.filter_by(acc_approval_status=1).all()
        
        return render_template("Accounts/AccAcceptedForms.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))

@app.route("/LCgeneratorPage")
def lCgeneratorlanding():
    if session.get("user_email") and session.get("user_type") == 5:
        
        print( f"Welcome, {session['user_email']} (YOu are an: {session['user_type']})")
        studentDetails = Student.query.filter_by(
        acc_approval_status=1,
        lib_approval_status=1,
        hod_approval_status=1).all()  # Fetch students with all approvals
        
        return render_template("LC_generator/landingLcGenerator.html",studentDetails=studentDetails)
    else:
        return redirect(url_for('err'))
    


# -----------------------------------------------Routes---------------------------------------------------------------------
@app.route('/updateApprovalofHOD', methods=['POST'])
def updateApprovalofHOD():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    
    # studentDetails = Student.query.all()
    # print(studentDetails)
    # print(f"Student data received: {studentDetails}")

    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.hod_approval_status = 1  # Directly setting 1
        
        
        
        # stud.hod_remarks
        # stud.hod_rejection_reason
        # hod rejection reason ,hod remark ,misconduct , achivements,
        # ye directly yaha insert nai kar saket request.form kar k kuch karna padega 
        
        
        print(stud.hod_approval_status)
        db.session.add(stud)
        db.session.commit()
        print("Approval status updated successfully!")
        return ({"message": "Approval updated successfully"}), 200
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404
    
@app.route('/updateRejectionOfHOD', methods=['POST','GET'])
def updateRejectionOfHOD():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    hod_remarks = data.get('hod_remarks')
    hod_rejection_reason = data.get('hod_rejection_reason')
    
    # if request.method == 'POST':
        # hod_remarks = request.form['hod_remarks']
        # hod_rejection_reason  = request.form['hod_rejection_reason']
        # student_id = request.form['student_id']

#   agar uper wala if k hishaab se chalege to ye niche ka pura if-else us k andar aiga ... abhi filhal k liye dusra method use kia hu isliye bahar leke solve kar ra hu
    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.hod_rejection_reason = hod_rejection_reason 
        stud.hod_remarks = hod_remarks  
        stud.hod_approval_status = 2  # Directly setting 1
        
        print(stud.hod_approval_status)
        print(stud.hod_remarks)
        print(stud.hod_rejection_reason)
        db.session.add(stud)
        db.session.commit()
        print("Rejected successfully!")
        return {"message": "Rejection updated successfully"}, 200
        # return redirect(url_for('hodlanding'))
            
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404
     

 
    
    
@app.route('/updateApprovaloflib', methods=['POST'])
def updateApprovaloflib():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')

    stud = Student.query.filter_by(sr_no=student_id).first()
    
    if stud:
        stud.lib_approval_status = 1  
        
        print(stud.lib_approval_status)
        db.session.add(stud)
        db.session.commit()
        print("Approval status updated successfully!")
        return ({"message": "Approval updated successfully"}), 200
    else:
        print("Student not found!")
    
    
@app.route('/updateRejectionOflib', methods=['POST','GET'])
def updateRejectionOflib():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    lib_remarks = data.get('lib_remarks')
    lib_rejection_reason = data.get('lib_rejection_reason')
    
    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.lib_rejection_reason = lib_rejection_reason 
        stud.lib_remarks = lib_remarks  
        stud.lib_approval_status = 2  # Directly setting 152222222222228                                                                                                                                                                                                                                                                                                                                                                                                 
        
        print(stud.lib_approval_status)
        print(stud.lib_remarks)
        print(stud.lib_rejection_reason)
        db.session.add(stud)
        db.session.commit()
        print("Rejected successfully!")
        return {"message": "Rejection updated successfully"}, 200
            
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404
    
    
    
    
    
    
@app.route('/updateApprovalofacc', methods=['POST'])
def updateApprovalofacc():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')

    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.acc_approval_status = 1  # Directly setting 1
        print(stud.acc_approval_status)
        db.session.add(stud)
        db.session.commit()
        print("Approval status updated successfully!")
        return ({"message": "Approval updated successfully"}), 200
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404
    

@app.route('/updateRejectionOfacc', methods=['POST','GET'])
def updateRejectionOfacc():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    acc_remarks = data.get('acc_remarks')
    acc_rejection_reason = data.get('acc_rejection_reason')
    
    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.acc_rejection_reason = acc_rejection_reason 
        stud.acc_remarks = acc_remarks  
        stud.acc_approval_status = 2  # Directly setting 1
        
        print(stud.acc_approval_status)
        print(stud.acc_remarks)
        print(stud.acc_rejection_reason)
        db.session.add(stud)
        db.session.commit()
        print("Rejected successfully!")
        return {"message": "Rejection updated successfully"}, 200
            
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404
    
    
# email send by lcGenerator after overall process
@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.get_json()
    recipient_email = data.get('email')

    subject = "Document Ready for Collection"
    body = f"Dear student,\n\nYour document is ready. Please collect it from the office.\n\nRegards,\nAdministration"

    sender_email = "arshkhn2000@gmail.com"
    sender_password = "gwld homk xmdy vdcb"
    

        
    # SMTP setup (example for Gmail)
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = recipient_email
 
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, [recipient_email], msg.as_string())
        server.quit()
        
        student = Student.query.filter_by(user_id=recipient_email).first()
        print(student)
        if student:
            student.LCgenerated = 1
            db.session.commit()

        return jsonify({'message': 'Email sent successfully.'})
    except Exception as e:
        print('Error sending email:', e)
        return jsonify({'message': 'Error sending email.'}), 500




if __name__ == "__main__":
    app.run(debug=True,port=8000)
    
    
    # now we will dive deep into the each user and create the full functionality of each user 
    
    # the hod table need's to have approval status and rejection remark of both library and accounts ... till now i have created the table but it is givig me error of foreign key constraint ... this can be due to i have not added the foreign key elements in the trigger 
    
    # we have did a few things wrong , the approval status and other flags that will be corrected by the hod librarian and accounts ... it wont be then updated in their table it will be updated in the students profile itself .... now what we have did is that we have updated the hod library and accounts table instead of student table
    # change the DB schmea for studts tabel and implement the above mentioned chanes
    
    # make the issue of accept and rejct proper ... the number 1 is getting printed but it is not getting dispalyed in the databse ,look into this issue 
