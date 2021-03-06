const signup = data => {
  console.log("from user-api.js");
  //   return "from user-api.js";
  // console.log(JSON.parse(data));
  return fetch("/api/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const checkAvailability = data => {
  return fetch("/api/checks", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const list = req => {
  return fetch("/api/users/" + req.query, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.log(e);
    });
};

const getCurrentUser = (params, credentials) => {
  return fetch("/api/users/" + params._id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.log(e);
    });
};

const updateCurrentUser = (params, credentials, req) => {
  return fetch("/api/users/" + params._id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify(req.body)
  })
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.log(e);
    });
};

const moveAndDelete = (param, auth) => {
  return fetch("/api/users/" + param.userData._id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.token
    },
    body: JSON.stringify(param.userData)
  })
    .then(response => {
      return response.json();
    })
    .catch(e => console.log(e));
};

export { signup, list, getCurrentUser, updateCurrentUser, moveAndDelete, checkAvailability };
