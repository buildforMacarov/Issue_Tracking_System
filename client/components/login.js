import React from 'react';
import axios from 'axios';

export class login extends React.Component {
    constructor(props) {
		super(props);

    }
    render() {
        return(
            <div class="container">
            <div class="card card-container">
                <img class="profile-img-card" src="images.jpeg" />
                <i class="glyphicon glyphicon-user"></i>
                <p id="profile-name" class="profile-name-card"></p>

                <form class="form-signin">

                        <span id="reauth-email" class="reauth-email"></span>
                        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus />
                        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required />

                        <div id="remember" class="checkbox">
                            <label>
                                <input type="checkbox" value="remember-me" /> Remember me
                            </label>
                        </div>

                        <div>
                           <input type="radio" id="acount-type1"
                            name="acount-type" value="user" />
                           <label for="account-type1">User</label>

                           <input type="radio" id="account-type2"
                            name="acount-type" value="developer" />
                           <label for="account-type2">Developer</label>

                           <input type="radio" id="account-type3"
                            name="acount-type" value="admin" />
                           <label for="account-type3">Admin</label>
                         </div>

                        <button class="btn btn-lg btn-primary btn-block btn-signin" type="submit">
                            Sign in
                        </button>

                </form>

                <a href="#" class="forgot-password">
                    Forgot the password?
                </a>
                {
                    $('form').submit(function() {
                        if($('#account-type1')) {
                            $.ajax({
                                async: true,
                                method: 'POST',
                                url: '/users/login',
                                data: $( this ).serialize(),
                                success: function(res) {
                                    console.log(res);
                                }
                            });
                        }
                        else if($('#account-type2')) {
                            $.ajax({
                                async: true,
                                method: 'POST',
                                url: '/developers/login',
                                data: $( this ).serialize(),
                                success: function(res) {
                                    console.log(res);
                                }
                            });
                        }
                        else if($('#account-tpe3')) {
                            $.ajax({
                                async: true,
                                method: 'POST',
                                url: '/admins/login',
                                data: $( this ).serialize(),
                                success: function(res) {
                                    console.log(res);
                                }
                            });
                        }
                        
                    })
                }
            </div>
        </div>
        );
    }
}



/*

<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Log In</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body>
        
        <script src="./jquery-3.3.1.min.js"></script>
        <script type="text/javascript">
            

        </script>

    </body>
</html>
*/