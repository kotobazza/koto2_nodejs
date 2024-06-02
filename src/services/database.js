const mysql = require("mysql2");

class Database{
    constructor(pool) {
        this.pool = pool;
    }

    async checkIsLoginPasswordPairExists(login, password){
        try{
            const selectLoginPassword = "SELECT * FROM users WHERE login= ? AND password = ?";
            const [select] = await this.pool.query(selectLoginPassword, [login, password]);
            if(select.length>0){
                return true;
            }
            else{
                return false;
            }
        }
        catch(error){
            console.log("checkLoginPassword error: ", error);
        }
    }

    async checkIsSubscribedTo(subscriber, subscribed_to){
        try{
            const checkIsSubscribedToSelect = "SELECT id FROM subscriptions WHERE subscriber = ? AND subscribed_to = ?";
            const [result] = await this.pool.query(checkIsSubscribedToSelect, [subscriber, subscribed_to])
            
            if(result.length > 0){
                return true;
            }
            
            return false
        }
        catch(error){
            console.log("checkIsSubscribedTo", error)
        }
    }


    async checkIsUserExists(id){
        try{
            const checkUserExistSelect = "SELECT id FROM users WHERE id = ?";
            const [result] = await this.pool.query(checkUserExistSelect, [id])
            if(result.length >0){
                return true
            }
            return false
        }
        catch(error){
            console.log("checkUserExists", error)
        }
    }

    async checkIsPublicationExists(id){
        try{
            const checkExists = "SELECT id FROM publications WHERE id = ?";
            const [result] = await this.pool.query(checkExists, [id])
            if(result.length > 0){
                return true
            }
            return false
        }
        catch(error){
            console.log("checkIsPublicationExists error", error)
        }
    }

    async checkIsPublicationLikedBy(publication, user){
        try{
            const select = "SELECT id FROM likes WHERE liked = ? AND liker=?"
            const [result] = await this.pool.query(select, [publication, user])
            if(result.length>0){
                return true
            }
            return false
        }
        catch(error){
            console.log("checkIsPublicationLikedBy error", error)
        }
    }


    async getUserId(login, password){
        try{
            const selectUser = "select id FROM users WHERE login= ? AND password = ?";
            const [result] = await this.pool.query(selectUser, [login, password]);
            return result[0].id;
        }
        catch(error){
            console.log("getUserId error: ", error);
        }
    }

    async getUserLogin(id){
        try{
            const selectUser = "select login FROM users WHERE id=?";
            const [result] = await this.pool.query(selectUser, [id]);
            return result[0].login;
        }
        catch(error){
            console.log("getUserLogin error: ", error);
        }
    }

    


    async getAllSubscriptions(userId){
        try{
            const select = `SELECT 
                                u.id,
                                u.login,
                                CASE 
                                    WHEN s.subscriber IS NOT NULL THEN 1
                                    ELSE 0
                                END AS is_subscribed
                            FROM 
                                users u
                            LEFT JOIN 
                                (SELECT subscribed_to, subscriber 
                                FROM subscriptions
                                WHERE subscriber = ?) s
                            ON 
                                u.id = s.subscribed_to
                            ORDER BY u.id DESC;
                        `;
            const [results] = await this.pool.query(select, [userId]);
            return results;
            
        }
        catch(error){
            console.log("getAllSubscritions error", error);
        }
    }


    async getAllPublications(user_id){
        try{
            const select = `
                SELECT * 
                FROM publications
                WHERE creator = ?
                ORDER BY id DESC
            `;
            const [result] = await this.pool.query(select, [user_id])
            return result;
        }
        catch(error){
            console.log("getAllPublications error", error)
        }
    }

    async getAllSubscribedPublications(user_id){
        try{
            const select = `
                            SELECT 
                            p.id,
                            p.title,
                            p.text,
                            p.category,
                            p.upload_file,
                            p.creator,
                            u.login,
                            COUNT(l.id) AS likes_count,
                            CASE 
                                WHEN ul.liker IS NOT NULL THEN 1
                                ELSE 0
                            END AS is_liked_by_user
                        FROM 
                            publications p
                        JOIN 
                            users u ON p.creator = u.id
                        JOIN 
                            subscriptions s ON s.subscribed_to = p.creator
                        LEFT JOIN 
                            likes l ON l.liked = p.id
                        LEFT JOIN 
                            likes ul ON ul.liked = p.id AND ul.liker = ?
                        WHERE 
                            s.subscriber = ?
                        GROUP BY 
                            p.id, p.title, p.text, p.upload_file, p.creator, u.login, ul.liker
                        ORDER BY 
                            p.id DESC;
        
        
                            ` 
            const [result] = await this.pool.query(select, [user_id, user_id])
            return result;
        }
        catch(error){
            console.log("getAllSubscribedPublications error", error)
        }
        
    }


    async getAllPublicationsFromOtherUser(user_id, other_id){
        try{
            const select = `SELECT 
                                p.id ,
                                p.title,
                                p.text,
                                p.category,
                                p.upload_file,
                                IFNULL(like_count.count, 0) AS likes_count,
                                IF(my_likes.liked IS NOT NULL, 1, 0) AS is_liked_by_user
                            FROM 
                                publications p
                            LEFT JOIN 
                                (SELECT liked, COUNT(*) AS count FROM likes GROUP BY liked) AS like_count
                                ON p.id = like_count.liked
                            LEFT JOIN 
                                likes my_likes
                                ON p.id = my_likes.liked AND my_likes.liker = ?
                            WHERE 
                                p.creator = ?
                            ORDER BY p.id DESC
            `//ненормальный запрос, требует два места для вставки айдишника поиска
            const [result] = await this.pool.query(select, [user_id, other_id])
            console.log(result)
            return result;
        }
        catch(error){
            console.log("getAllPublicationsFromOtherUser error", error)
        }
    }

    


    async getPublication(id){
        try{
            const select = "SELECT * FROM publications WHERE id = ?"
            const [result] = await this.pool.query(select, [id])
            return result
        }
        catch(error){
            console.log("getPublication error", error)
        }
        
    }


    async getLikes(publication){
        try{
            const select = "SELECT COUNT(*) as value FROM likes WHERE liked = ?"
            const [result] = await this.pool.query(select, [publication])
            return result[0].value
        }
        catch(error){
            console.log("getLikes error", error)
        }

    }



    async addUser(login, password){
        try{
            const insertNewUser = "INSERT INTO users VALUES (NULL, ?, ?)";
            const [result] = await this.pool.query(insertNewUser, [login, password]);
            return result.insertId;
        }
        catch(error){
            console.log("addUser error: ", error);
        }
    }

    async addSubscription(subscriber, subscribed_to){
        try{
            const isnertNewSubs = "INSERT INTO subscriptions VALUES (NULL, ?, ?)"
            const [result] = await this.pool.query(isnertNewSubs, [subscribed_to, subscriber])
            return result.insertId
        }
        catch(error){
            console.log("addSubscription", error)
        }
    }

    async addPublication(creator, publication_title, publication_text, publication_category, publication_image){
        try{
            const insert = "INSERT INTO publications VALUES (NULL, ?, ?, ?, ?, ?)";
            const [result] = await this.pool.query(insert, [publication_title, publication_text, creator, publication_category, publication_image])
            return result.insertId
        }
        catch(error){
            console.log("addPublication error", error)
        }
    }

    async addLike(publication, user){
        try{
            const insert = "INSERT INTO likes VALUES (NULL, ?, ?)"
            const [result] = await this.pool.query(insert, [user, publication])
            return result.insertId
        }
        catch(error){
            console.log("addLike error", error)
        }
    }

    async addFeedbackReport(user_id, theme, text, email, reason, rate){
        try{
            const insert = "INSERT INTO feedbacks VALUES (NULL, ?, ?, ?, ?, ?, ?)";
            const [result] = await this.pool.query(insert, [user_id, theme, text, email, reason, rate])
            return result.insertId
        }
        catch(error){
            console.log("addFeedbackReport error", error)
        }
    }


    async updatePublication(id, title, text, upload_file){
        try{
            const update = "UPDATE publications SET title = ? , text= ? , upload_file = ? WHERE id = ?"
            const [result] = await this.pool.query(update, [title, text, upload_file, id])
        }
        catch(error){
            console.log("updatePublication error", error)
        }
        
    }

    

    async deleteSubscription(subscriber, subscribed_to){
        try{
            const deleteSubs = "DELETE FROM subscriptions WHERE subscriber = ? AND subscribed_to = ?"
            const [result] = await this.pool.query(deleteSubs, [subscriber, subscribed_to])
        }
        catch(error){
            console.log("deleteSubscription error", error)
        }
    }

    async deletePublication(id){
        try{
            const deletePub = "DELETE FROM publications WHERE id = ?"
            const [result] = await this.pool.query(deletePub, [id])
        }
        catch(error){
            console.log("deletePublication error", error)
        }
    }

    async deleteLike(publication, user){
        try{
            const deleteL = "DELETE FROM likes WHERE liked = ? AND liker=?"
            const [result] = await this.pool.query(deleteL, [publication, user])
        }
        catch(error){
            console.log("deleteLike error", error)
        }
    }

    async deleteAllLikesFromPublication(publication){
        try{
            const deleteLikes = "DELETE FROM likes WHERE liked=?"
            const [result] = await this.pool.query(deleteLikes, [publication])
        }
        catch(error){
            console.log("deleteAllLikesFromPublication error", error)
        }
        
    }
    


}







const connection = mysql.createPool({
    host : 'localhost',
    user: 'root',
    password: 'root',
    database: 'koto2_nodejs',
}).promise();

const database = new Database(connection);

module.exports = database;
