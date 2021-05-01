dbPassword= `mongodb+srv://admin:${process.env.SECRET_KEY}@legacy-sy9ll.mongodb.net/realestate?retryWrites=true&w=majority`;

module.exports = {
    mongoURI: dbPassword
};
