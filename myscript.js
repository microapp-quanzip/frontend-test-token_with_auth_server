
var clientId = "quanzip";
var clientSecret = "123";
var scope = "read write";
var callbackURI = "http://localhost:5500";

var authURL = 'http://localhost:9000/oauth/authorize?client_id=' + clientId + '&scope=' + scope + '&redirect_uri=' + callbackURI + '&response_type=code'

$(document).ready(function () {
    $("#login-btn").attr("href", authURL)
    $("#list-account-btn").click(getAccounts)
    $("#logout-btn").click(logout)

    checkToken()
})

var checkToken = function () {
    var token = localStorage.getItem("token");

    if (token) {
        $("#login-btn").css("display", "none")
        $("#content").css("display", "block")

        $("#token").html(token)

    } else {
        $("#content").css("display", "none")
        $("#login-btn").css("display", "block")

        let authorizationCode = getUrlParameter("code")
        if (authorizationCode) {
            getAccessToken(authorizationCode)
        }
    }
}

var getAccessToken = function (code) {
    var settings = {
        "url": "http://localhost:9000/oauth/token?grant_type=authorization_code&code=" + code + "&redirect_uri=" + callbackURI,
        "method": "POST",
        "headers": {
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        localStorage.setItem("token", JSON.stringify(response))
        checkToken()
    });
}

var getAccounts = function () {
    var token = localStorage.getItem("token");
    if (!token) return

    var accessToken = JSON.parse(token).access_token

    var settings = {
        "url": "http://localhost:8080/user/accounts",
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#accounts").html(JSON.stringify(response))
    });
}

var logout = function () {
    localStorage.removeItem("token")
    window.location.replace(callbackURI)
}

var getUrlParameter = function (sParam) {
    var sPageURL = window.location.search.substring(1)
    var sURLVariables = sPageURL.split('&')
    var sParameterName
    var i

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};