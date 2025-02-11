export const fetchWithUserAuth = async (url, options = {}) => {
    const userToken = localStorage.getItem('jwt');
    const authHeaders = {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };
  
    const fetchOptions = {
        ...options,
        headers: authHeaders,
    };
  
    return fetch(url, fetchOptions);
};

export const fetchWithAdminAuth = async (url, options = {}) => {
    const adminToken = localStorage.getItem('jwtAdmin');
  
    const authHeaders = {
       'Authorization': `Bearer ${adminToken}`,
        ...options.headers,
    };
  
    const fetchOptions = {
        ...options,
        headers: authHeaders,
    };
  
    return fetch(url, fetchOptions);
};