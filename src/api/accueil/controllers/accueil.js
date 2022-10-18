'use strict';

/**
 *  accueil controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::accueil.accueil',
    ({ strapi }) => ({
        async Order(ctx) {
            const order = await await strapi.entityService.findMany('api::accueil.accueil', {
                populate: {
                    Structure:  {
                        populate : {
                            mediaPreview: {
                                fields: ["url"]
                            },
                            stat: '*',
                            carousel: {
                                populate: {
                                    img: {
                                        fields: ["url"]
                                    }
                                }
                            },
                            TopFormation2: {
                                fields: ["id", "title", "slug", "totalCourseMinutes", "price","showPrice"],
                                populate: {
                                    image: {
                                        fields: ["url"]
                                    },
                                    formations_category: {
                                        fields: ["title", "icon", "slug","buttonIcon"]
                                    },
                                    commandes_formations: {
                                        filters: {
                                            payement: {
                                                $eq: "payé"
                                            }
                                        }
                                    },
                                    financeurs: {
                                        fields: ["Url"],
                                        populate: {
                                            Logo: {
                                                fields: ["url"]
                                            }
                                        }
                                    },
                                    Modules: {
                                        fields: ["id"]
                                    },
                                    ratings: {
                                        fields: ["rate"]
                                    }
                                }
                            },
                            TopFormation1: {
                                fields: ["id", "title", "slug", "totalCourseMinutes", "price","showPrice"],
                                populate: {
                                    image: {
                                        fields: ["url"]
                                    },
                                    formations_category: {
                                        fields: ["title", "icon", "slug","buttonIcon"]
                                    },
                                    commandes_formations: {
                                        filters: {
                                            payement: {
                                                $eq: "payé"
                                            }
                                        }
                                    },
                                    financeurs: {
                                        fields: ["Url"],
                                        populate: {
                                            Logo: {
                                                fields: ["url"]
                                            }
                                        }
                                    },
                                    Modules: {
                                        fields: ["id"]
                                    },
                                    ratings: {
                                        fields: ["rate"]
                                    }
                                }
                            }
                        }
                    }
                }
            });
            ctx.send(order)

        },




    }
    )
);
