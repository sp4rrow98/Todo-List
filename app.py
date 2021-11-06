from flask import Flask, request, flash, url_for, redirect, render_template
from flask_login.utils import login_required, logout_user
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user

# Flask config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config['SECRET_KEY'] = "b'QlJ\x99\xf2\xb1\x87\xc0\x87\x1b\xd7\xe9\xd3\xef\x9d\xe5'"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#  DataBase
db = SQLAlchemy(app)

# Login cofig
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)

class Users(db.Model, UserMixin):
    id = db.Column('user_id', db.Integer, primary_key = True)
    username = db.Column(db.String(100))
    password = db.Column(db.String(50))
    passwordConfirm = db.Column(db.String(200)) 
    def __init__(self, username, password, passwordConfirm):
        self.username = username
        self.password = password
        self.passwordConfirm = passwordConfirm

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect('/')

@app.route('/todolist')
@login_required
def todolist():
   return render_template('todolist.html')

@app.route('/', methods = ['POST', 'GET'])
def login():
   if request.method == "GET":
      return render_template('login.html', title='Login')
   if request.method == "POST":
      users = Users.query.all()
      username = request.form['username']
      passw = request.form['password']
      if not username and passw:
         flash('Enter username and password', 'danger')
      elif not username:
         flash('You need to add an username', 'danger')
      elif not passw:
         flash('You need to add a valid password', 'danger')
      else:
         for user in users:
            if user.username == username and user.password == passw:
               login_user(user)
               return render_template('todolist.html')
         flash('Username or password not valid', 'danger')
   return render_template('login.html')

@app.route('/register', methods = ['POST', 'GET'])
def register():
    if request.method == "POST":
        users = Users.query.all()
        for user in users:
            if user.username == request.form['username']:
                flash('This username is taken', 'warning')
            if not request.form['username']:
                flash('Complete the username field.', 'warning')
            elif not request.form['password']:
                flash('Complete the password field', 'warning')
            elif not request.form['passwordConfirm']:
                flash('You need to complete all fields.', 'warning')
            elif request.form['password'] != request.form['passwordConfirm']:
                flash('Confirm the password.', 'warning')
        user = Users(request.form['username'], request.form['password'], request.form['passwordConfirm'])
        db.session.add(user)
        db.session.commit()
        flash('User registred complete!', 'success')
        return redirect(url_for("login"))
    return render_template('register.html', title='Register')

@app.before_first_request
def create_tables():
    db.create_all()