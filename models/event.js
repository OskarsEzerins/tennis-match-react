const { Op } = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  const Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    eventStatus: DataTypes.STRING,
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vicinity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  Event.associate = function (models) {
    Event.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
    Event.belongsTo(models.User, {
      as: 'secondUser',
      foreignKey: 'confirmedByUser'
    })
  }

  async function checkForOverlappingEvents(event) {
    const overlappingEvent = await Event.findOne({
      where: {
        UserId: event.UserId,
        [Op.or]: [
          {
            start: {
              [Op.lt]: event.end
            },
            end: {
              [Op.gt]: event.start
            }
          },
          {
            [Op.and]: [
              {
                start: {
                  [Op.lte]: event.start
                }
              },
              {
                end: {
                  [Op.gte]: event.end
                }
              }
            ]
          }
        ]
      }
    })

    if (overlappingEvent) {
      throw new Error('This event overlaps with an existing event.')
    }
  }

  Event.beforeCreate(async (event, _options) => {
    await checkForOverlappingEvents(event)
  })

  Event.beforeUpdate(async (event, _options) => {
    await checkForOverlappingEvents(event)
  })

  return Event
}
