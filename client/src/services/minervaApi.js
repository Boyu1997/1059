const server = "https://us-central1-boyu-io.cloudfunctions.net/minerva-1059"

const headers = {
  'Accept': '*/*',
}

export const getUserId = (token) =>
  fetch(`${server}?type=getUserId&token=${token}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json())


export const getUserInfo = (token, id) =>
  fetch(`${server}?type=getUserInfo&id=${id}&token=${token}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json())

export const getHcItems = (token) =>
  fetch(`${server}?type=getHcItems&token=${token}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json()).then(data => {
    let hcItems = [];
    data['hc-group-nodes'].forEach(group => {
      if (group['hc-group-nodes']) {
        group['hc-group-nodes'].forEach(node => {
          node['hc-leaf-nodes'].forEach(leaf => {
            hcItems.push(leaf['hc-item']);
          });
        });
      }
    });
    return hcItems;
  });

export const getHcScores = (token) =>
  fetch(`${server}?type=getHcScores&token=${token}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json())

export const getHcPerformances = (token, id) =>
  fetch(`${server}?type=getHcPerformances&id=${id}&token=${token}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json())

export const getAssignmentPage = (token, id) =>
  fetch(`${server}?type=getAssignmentPage&id=${id}&token=${token}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json())


export const getClassPage = (token, id, hc) =>
  fetch(`${server}?type=getClassPage&id=${id}&token=${token}&hc=${hc}`, {
    method: 'GET',
    headers: headers
  }).then(res => res.json())