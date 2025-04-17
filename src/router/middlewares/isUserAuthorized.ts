const isUserAuthorized = () => {
	return Boolean( localStorage.getItem('token') );
};

export { isUserAuthorized };