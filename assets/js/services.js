'use strict';

/* Services */
angular.module('chronicles.services', [])
    .factory('Channels', function(){
        return {
            index:0,
            current:'',
            all: [],
            fetch: function(){
                var channels = ['FAMILY','THOUGHTS', 'PHOTOS', 'CHECK-IN']                
                channels.unshift('EVERYTHING');            
                this.all = channels;
                this.current = this.all[this.index];
            },
            next: function(){
                var idx = this.index + 1;
                if(idx <= this.all.length - 1){
                    this.current = this.all[idx];
                    this.index = idx;
                }
            },
            previous: function(){
                var idx = this.index - 1;
                if(idx >= 0){
                    this.current = this.all[idx];
                    this.index = idx;
                }
            }
        }
    })
    .factory('Chronicles', function($location){
        return {
            index: 0,
            bio: {},
            all: [],
            current:{},
            previous: function(){
                var idx = this.index - 1;
                if(idx >= 0){
                    this.fetch(this.all[idx]._id);
                }                
            },          
            next: function(){
                var idx = this.index + 1;
                if(idx <= this.all.length - 1){
                    this.fetch(this.all[idx]._id);
                }       
            },                      
            fetch: function(chronicle){
                var self = this;
                this.all = [
                    {
                        _id: 'bio',
                        title: {
                            text: 'kc merrill',
                            font: {
                                color: 'white',
                                shadow: 'black',
                                face: 'oswald',                        
                                size: 40
                            },
                            background: {
                                r: 0,
                                g: 0,
                                b: 0,
                                a: .6                                
                            }
                        },                    
                        layout: 'bio/basic',
                        content: "Adventurer. Dreamer. Explorer. Doer. Full time Software engineer, part time running/soccer/outdoor/camping loon.\n\nA black belt in Google-Fu and a superpower that lets me turn off street lights simply by walking past them.\n\nThis is my digital life. My pursuit of happiness.\n\nWelcome.",
                        media: 'img/bella_and_i.jpg',                    
                        thumbnail: {
                            image: 'img/bella_and_i.jpg',
                            icon: {
                                class: 'home',
                                color: 'white'
                            },    
                        },                    
                        map: {
                            location: 'Denver, Colorado',
                            zoom: 9
                        },
                        facebook: 'http://facebook.com/kc.merrill',
                        twitter: 'http://twiter.com/themayor',
                        github: 'http://github.com/kcmerrill',
                        youtube: 'http://youtube.com/kcmerrill',
                        flickr: 'http://flickr.com/photos/kcmerrill',
                        channels: [
                            {label: 'My Timeline', tag: ''},
                            {label: 'Blog', tag: 'blog'},
                            {label: 'Photo Album', tag: 'photo'},
                            {label: 'Code', tag: 'code'},
                            {label: 'Check-In', tag: 'check-in'}
                        ]
                    },                    
                    {
                        _id: '1',
                        title: { 
                            text: 'If I can be an example of getting sober, then I can be an example of starting over. #macklemore',
                            font: {
                                color: 'white',
                                shadow: 'black',
                                face: 'oswald',                        
                                size: 40
                            }                        
                        },           
                        content: '',
                        layout: 'thought/lower-left',
                        media: 'http://upload.wikimedia.org/wikipedia/commons/4/48/Macklemore_The_Heist_Tour_1.jpg',
                        thumbnail: {
                            image: 'http://upload.wikimedia.org/wikipedia/commons/4/48/Macklemore_The_Heist_Tour_1.jpg',
                            icon: {
                                class: 'quote-right',
                                color: 'white'
                            },    
                        },                          
                        created: 'Dec 3, 2013'
                    },
                    {
                        _id: '5',
                        title: { 
                            text: 'My retirement, in case my real retirement goes south.',
                            font: {
                                color: 'white',
                                shadow: 'black',
                                face: 'oswald',                        
                                size: 40
                            }                        
                        },           
                        content: '',
                        layout: 'thought/lower-left',
                        media: 'img/retirement.png',
                        thumbnail: {
                            image: 'img/retirement.png',
                            icon: {
                                class: 'quote-right',
                                color: 'white'
                            },    
                        },                          
                        created: 'Dec 3, 2013'
                    },                    
                    {
                        _id: '2',
                        title: { 
                            text: "If strength is born from heartbreak, then mountains I could move and if these walls could speak, I\'d pray they tell me what to do.  #riseagainst",
                            font: {
                                color: 'white',
                                shadow: 'black',
                                face: 'oswald',                        
                                size: 40
                            }                        
                        },   
                        content: '',
                        layout: 'thought/lower-left',
                        media: 'http://mindequalsblown.net/wp-content/uploads/2013/07/rise-against-4e74b62ede14f.jpg',
                        thumbnail: {
                            image: 'http://mindequalsblown.net/wp-content/uploads/2013/07/rise-against-4e74b62ede14f.jpg',
                            icon: {
                                class: 'quote-right',
                                color: 'white'
                            },    
                        },                          
                        created: 'Dec 4, 2013'
                    },                    
                    {
                        _id: '3',
                        title: { 
                            text: '',
                            font: {
                                color: 'white',
                                shadow: 'black',
                                face: 'oswald',                        
                                size: 40
                            }                        
                        },   
                        content: '',
                        layout: 'map/basic',
                        media: '',
                        thumbnail: {
                            image: 'http://maps.googleapis.com/maps/api/staticmap?center=Lubbock,TX&zoom=10&size=100x100&sensor=false',
                            icon: {
                                class: 'map-marker',
                                color: 'red'
                            },    
                        },                              
                        map: {
                            location: 'Lubbock,TX',
                            zoom: 14,
                            center: {
                                lat: 33.575721477996275, 
                                lon: -101.86301904296873
                            }
                        },                        
                        created: 'Dec 5, 2013'
                    },                    
                    {
                        _id: '8',
                        title: { 
                            text: "Everything that I believe is fading. #godsmack",
                            font: {
                                color: 'white',
                                shadow: 'black',
                                face: 'oswald',                        
                                size: 40
                            }                        
                        },   
                        content: '',
                        layout: 'thought/lower-left',
                        media: 'http://api.ning.com/files/KFuO3I1I1MXqj0OtR4L0IPtfyeyuvFLt-tw4QDEk2Pk6tkHQtHByxERqWzwV0Hr5Nhn*3zR7TGXv7sadsjzVzja7GBvaKMJn/Godsmack.jpg',
                        thumbnail: {
                            image: 'http://api.ning.com/files/KFuO3I1I1MXqj0OtR4L0IPtfyeyuvFLt-tw4QDEk2Pk6tkHQtHByxERqWzwV0Hr5Nhn*3zR7TGXv7sadsjzVzja7GBvaKMJn/Godsmack.jpg',
                            icon: {
                                class: 'quote-right',
                                color: 'white'
                            },    
                        },                          
                        created: 'Dec 4, 2013'
                    }
                ];
                /* We need to assign the index to each object, so we can do fwd, prev ect ... */
                _.each(self.all, function(obj, idx){
                    self.all[idx].index = idx;
                });
                
                /* Set the current chronicle to what was selected */
                self.current = _.findWhere(this.all, {_id: chronicle});
                self.index = self.current.index;                
                
                /* If we fetched the bio, lets be sure to save it off */
                if(chronicle == 'bio'){
                    this.bio = this.current;
                }
                
                /* If the bio is empty, lets be sure to fetch it, as we'll need it eventually */
                if(this.bio == {}){
                    this.fetch('bio');
                }
                
                /* Update the page location to be the correct id */
                $location.url(this.current._id);
            }
        };
    });