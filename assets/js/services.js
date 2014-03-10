/* Services */
angular.module('chronicles.services', [])
    .factory('Channels', function(){
        return {
            selected_idx:0,
            current:'',
            channels: ['EVERYTHING', 'ABOUT-ME', 'MUSIC', 'THOUGHTS', 'BLOG', 'PHOTOS', 'FUNNY', 'CHECK-IN', 'CODE'],
            list: function(){
                this.current = this.channels[this.selected_idx];
            },
            next: function(){
                var self = this;
                var idx = self.selected_idx + 1;
                if(idx <= self.channels.length - 1){
                    self.current = this.channels[idx];
                    self.selected_idx = idx;
                }
                return self.current;
            },
            previous: function(){
                var self = this;
                var idx = self.selected_idx - 1;
                if(idx >= 0){
                    self.current = self.channels[idx];
                    self.selected_idx = idx;
                }
                return self.current;
            }
        }
    })
    .factory('Chronicles', function($location, $http, Channels){
        return {
            selected_idx: 0,
            timeline: [],
            images:[],
            current:{},
            loaded: false,
            loaded_timeline: '',
            loading: [],
            limit: 100,
            channels: Channels,
            mediaToYouTube: function(){
                return this.current.media.replace("watch?v=","embed/") + '?controls=0&autoplay=1';
            },
            previous: function(){
                var idx = this.selected_idx - 1;
                if(idx >= 0){
                    this.fetch(this.timeline[idx].id);
                }
            },
            next: function(){
                var idx = this.selected_idx + 1;
                if(idx <= this.timeline.length - 1){
                    this.fetch(this.timeline[idx].id);
                }
            },
            init: function(callback){
                var self = this;

                if(self.loaded){
                    return false;
                }

                /* Fetch our timeline */
                self.fetchTimeline('everything', function(){
                    /* Fetch our bio */
                    self.fetch('bio', true, true, callback);
                });
                /* Load our channels */
                Channels.list();
                self.loaded = true;
            },
            fetchTimeline: function(channel, callback){
                var self = this;
                var params = {
                    limit: self.limit,
                    sort: "updatedAt DESC"
                };

                /* Have we already loaded the appropriate timeline? */
                if(channel.toLowerCase() == self.loaded_timeline.toLowerCase()){
                    return true;
                }

                /* Reset the timeline */
                self.timeline = [];

                /* If we have a specific channel, lets be sure to call it out specifically */
                if(channel.toLowerCase() != 'everything'){
                    params.channels = channel;
                }
                $http({method: 'GET', url: '/chronicles', params: params}).
                  success(function(data, status, headers, config) {
                    self.timeline = _.filter(data, function(c){ return c.id != 'bio'});

                    /* We need to assign the index to each object, so we can do fwd, prev ect ... */
                    _.each(self.timeline, function(obj, idx){
                        self.timeline[idx].index = idx;
                    });

                    /* set loaded timeline */
                    self.loaded_timeline = channel;
                    /* Be sure to perform the appropriate callback */
                    if(typeof callback == 'function'){
                        callback();
                    }
                });
            },
            /** Will try to fetch specific chronicles from db if not already loaded **/
            fetch: function(chronicle, render, assign, callback){
                var self = this;
                render = render == undefined ? true : render;
                assign = assign == undefined ? false : assign;

                /* No need to load an empty chronicle */
                if(_.isEmpty(chronicle)){
                    return true;
                }

                /* Search the timeline cache first */
                var fetched = _.findWhere(self.timeline, {id: chronicle});

                /* Was this a special chronicle? If so, no need to reload it! */
                if(fetched == undefined && _.has(self, chronicle)){
                    fetched = self[chronicle];
                }

                /* Still no dice? Fine fine, fetch it from the db */
                if(fetched == undefined && _.indexOf(self.loading, chronicle) < 0){
                    self.loading.push(chronicle);
                    $http({method: 'GET', url: '/chronicles/' + chronicle})
                        .error(function(data, status, headers, config){
                            $location.url('error');
                        })
                        .success(function(data, status, headers, config) {
                        fetched = data;
                        self.loading = _.filter(self.loading, function(c){ return c != chronicle});
                        return self.fetched(chronicle, fetched, render, assign, callback);
                    });
                } else {
                    return self.fetched(chronicle, fetched, render, assign, callback);
                }

                return self.fetched(chronicle, fetched, true, false, callback);
            },
            /* After a chronicle has been 'fetched', do the post processing on it */
            fetched: function(chronicle_id, chronicle, render, assign, callback){
                var self = this;
                if(assign && chronicle){
                    self.assign(chronicle_id, chronicle);
                }

                if(render && chronicle){
                    self.current = chronicle;
                    /* Make sure to transform the tags for editing */
                    if(self.current.channels !== undefined && typeof self.current.channels != 'string'){
                        self.current.channels = self.current.channels.join();
                    }
                    /* Be sure to update the template for the chronicle */
                    self.render(chronicle_id);
                    /* Update the selected index for the prev/next arrows */
                    self.selected_idx = self.current.index;
                }

                if(typeof callback == 'function'){
                    callback();
                }
            },
            render: function(chronicle_id){
                var self = this;
                /* Only render if current chronicle is set */
                if(!_.isEmpty(self.current)){
                    $location.url(chronicle_id);
                }
            },
            assign: function(chronicle_id, chronicle){
                var self = this;
                self[chronicle_id] = chronicle;
                self[chronicle_id].index = -1;
            },
            save: function(){
                var self = this;
                /* Copy the media to the thumbnail automagically */
                self.current.thumbnail.image = self.current.media;
                /* If the image is a youtube video, lets go ahead and fetch the youtube thunbmail instead! */
                if(self.current.thumbnail.image.indexOf('youtube.com') != -1){
                    self.current.thumbnail.image = 'http://img.youtube.com/vi/' + self.current.thumbnail.image.split("v=")[1] + '/1.jpg';
                }

                console.log(self.current.thumbnail.image);
                return true;
                if(typeof self.current.channels == 'string'){
                    /* Be sure to split the channels so they are back as an array */
                    self.current.channels = self.current.channels.split(',');
                }
                /* Take the current chroncile and upsert it */
                if(self.current.id){
                    $http.put('/chronicles/' + self.current.id, self.current).success(function(){
                        console.log('Updated!');
                    });
                } else {
                    $http.post('/chronicles', self.current).success(function(){
                        console.log('Created!');
                    });
                }
            },
            photos: function(){
                var self = this;
                $http.get('/users/' + self.bio.email + '/photos/').success(function(p){
                    self.images = p.photos.photo;
                });
            },
            photo: function(photo_id){
                var self = this;
                $http.get('/users/' + self.bio.email + '/photos/' + photo_id).success(function(photos){
                    self.current.media = photos.sizes.size[photos.sizes.size.length - 1].source;
                });

            },
            blank: function(){
                var self = this;
                /* Create a default chronicle. For starters, lets just setup basic colors and fonts */
                self.current = {
                    created : moment().format('MMM Do YYYY'),
                    channels: [],
                    thumbnail: {
                        image: "",
                        icon: {
                            class: "edit",
                            color: "white"
                        }
                    },
                    title: {
                        text: "Sample Text",
                        font: {
                            color: "white",
                            shadow: "black",
                            face: "oswald",
                            size: 40
                        },
                        background: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0.6
                        }
                    },
                    media: "img/media.gif",
                    content: {
                        text : "Sample text",
                        background: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0.6
                        }
                    }
                };
            }
        };
    });
