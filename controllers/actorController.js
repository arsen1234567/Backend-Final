const request = require('request');
const Actor = require('../models/actorModel');
const User = require('../models/userModel');

const API_KEY = 'QAgVoFhkCyI2ufp4+6oswg==YyupwJuA3Djv5FqP';

const saveActorDataToHistory = async (userId, actorId) => {
    try {
        await User.findByIdAndUpdate(userId, {
            $push: {
                history: {
                    type: 'Actor',
                    refId: actorId
                }
            }
        });
    } catch (error) {
        console.error("Error updating user history with actor data:", error);
    }
};

exports.searchActor = async (req, res) => {
    const actorName = req.query.actorName || 'Tom Hanks'; // Default actor name
    const options = {
        url: `https://api.api-ninjas.com/v1/celebrity?name=${encodeURIComponent(actorName)}`,
        headers: {
            'X-Api-Key': API_KEY
        }
    };

    request.get(options, async (error, response, body) => {
        if (error) {
            console.error('Request failed:', error);
            return res.status(500).send('Error fetching actor information');
        } else if (response.statusCode != 200) {
            console.error('Error:', response.statusCode, body);
            return res.status(response.statusCode).send(body);
        } else {
            const actorData = JSON.parse(body)[0]; // Assuming the first result is the desired actor

            if (!actorData) {
                return res.status(404).send('Actor not found');
            }

            // Attempt to find or create the actor in your database
            let actor = await Actor.findOneAndUpdate({ name: actorData.name }, {
                $setOnInsert: {
                    name: actorData.name,
                    net_worth: actorData.net_worth,
                    gender: actorData.gender,
                    nationality: actorData.nationality,
                    occupation: actorData.occupation.slice(0, 3), // Only store the first 3 occupations
                    height: actorData.height,
                    birthday: actorData.birthday
                }
            }, { upsert: true, new: true, setDefaultsOnInsert: true });

            // Assuming you have a session with userId and want to save this search to history
            const userId = req.session.userId;
            await saveActorDataToHistory(userId, actor._id);

            // Render a view for displaying actor information, passing the actor data and user information
            res.render('actor', { actor: actor, user: await User.findById(userId) });
        }
    });
};