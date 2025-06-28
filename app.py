
from flask import Flask,render_template,request,flash,redirect,url_for;
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pymysql
from werkzeug.security import check_password_hash

pymysql.install_as_MySQLdb()

app = Flask(__name__)
app.secret_key = "123456789"
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:root123@localhost/LCsystem"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ------------------------------- TABLE CLASS DECLARATION -------------------------------


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
        # print(user.user_type)
        
            # Redirect based on user_type
        # print(user.password)
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

    return render_template("User/signIn.html")


@app.route("/studentPage",methods=['GET', 'POST'])
def studentlanding():
    return render_template("students/landingStud.html")

@app.route("/apply",methods=['GET', 'POST'])
def studentapply():
    if request.method == 'POST':
        # print(request.form)
        user_id = request.form['user_id']
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



@app.route("/adminsPage")
def adminlanding():
    return render_template("admin/landingAdmin.html")



@app.route("/hodPage",methods=['GET', 'POST'])
def hodlanding():
    studentDetails = Student.query.all()
    # print(studentDetails)
      
    return render_template("HODs/landingHod.html", studentDetails=studentDetails)

@app.route("/HODacceptedForms")
def HODacceptedForm():
    studentDetails = Student.query.filter_by(hod_approval_status=1).all()
    return render_template("HODs/HODacceptedForms.html",studentDetails=studentDetails)

@app.route("/HODrejectedForms")
def HODrejectedForm():
    return render_template("HODs/HODrejectedForms.html")



@app.route("/librarianPage",methods=['GET', 'POST'])
def librarianlanding():
    studentDetails = Student.query.all()
    print("librarian",studentDetails)
    return render_template("librarian/landingLibrary.html",studentDetails=studentDetails)

@app.route("/librarianAcceptedForms")
def librarianAcceptedForm():
    return render_template("librarian/librarianAcceptedForms.html")

@app.route("/librarianRejectedForms")
def librarianRejectedForm():
    return render_template("librarian/librarianRejectedForms.html")




@app.route("/accountsPage",methods=['GET', 'POST'])
def accountslanding():
    studentDetails = Student.query.all()
    print("accounts",studentDetails)
    return render_template("Accounts/landingAccounts.html",studentDetails=studentDetails)

@app.route("/AccountsRejectedForms")
def AccountsRejectedForm():
    return render_template("Accounts/AccRejectedForms.html")

@app.route("/AccountsAcceptedForms")
def AccountsAcceptedForm():
    return render_template("Accounts/AccAcceptedForms.html")

@app.route("/LCgeneratorPage")
def lCgeneratorlanding():
    studentDetails = Student.query.filter_by(
        acc_approval_status=1,
        lib_approval_status=1,
        hod_approval_status=1
    ).all()  # Fetch students with all approvals
    print(studentDetails)
    return render_template("LC_generator/landingLcGenerator.html",studentDetails=studentDetails)


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
    
@app.route('/updateRejectionOfHOD', methods=['POST'])
def updateRejectionOfHOD():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    
    # studentDetails = Student.query.all()
    # print(studentDetails)
    # print(f"Student data received: {studentDetails}")

    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.hod_approval_status = 2  # Directly setting 1
        
        print(stud.hod_approval_status)
        db.session.add(stud)
        db.session.commit()
        print("Approval status updated successfully!")
        return ({"message": "Approval updated successfully"}), 200
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404


    
    
@app.route('/updateApprovaloflib', methods=['POST'])
def updateApprovaloflib():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    
    # studentDetails = Student.query.all()
    # print(studentDetails)
    # print(f"Student data received: {studentDetails}")

    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.lib_approval_status = 1  # Directly setting 1
        print(stud.lib_approval_status)
        db.session.add(stud)
        db.session.commit()
        print("Approval status updated successfully!")
        return ({"message": "Approval updated successfully"}), 200
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404
    
    
@app.route('/updateApprovalofacc', methods=['POST'])
def updateApprovalofacc():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    
    # studentDetails = Student.query.all()
    # print(studentDetails)
    # print(f"Student data received: {studentDetails}")

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
    

@app.route('/updateRejectionOfacc', methods=['POST'])
def updateRejectionOfacc():
    data = request.get_json()  # get the JSON data sent by JS
    student_id = data.get('student_id')
    

    stud = Student.query.filter_by(sr_no=student_id).first()
    if stud:
        stud.acc_approval_status = 2  # Directly setting 1
        print(stud.acc_approval_status)
        db.session.add(stud)
        db.session.commit()
        print("Rejection status updated successfully!")
        return ({"message": "Rejection updated successfully"}), 200
    else:
        print("Student not found!")
        return ({"message": "Student not found"}), 404




if __name__ == "__main__":
    app.run(debug=True,port=8000)
    
    
    # now we will dive deep into the each user and create the full functionality of each user 
    
    # the hod table need's to have approval status and rejection remark of both library and accounts ... till now i have created the table but it is givig me error of foreign key constraint ... this can be due to i have not added the foreign key elements in the trigger 
    
    # we have did a few things wrong , the approval status and other flags that will be corrected by the hod librarian and accounts ... it wont be then updated in their table it will be updated in the students profile itself .... now what we have did is that we have updated the hod library and accounts table instead of student table
    # change the DB schmea for studts tabel and implement the above mentioned chanes
    
    # make the issue of accept and rejct proper ... the number 1 is getting printed but it is not getting dispalyed in the databse ,look into this issue 