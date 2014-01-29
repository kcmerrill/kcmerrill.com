/* Services */
angular.module('chronicles.services', [])
    .factory('Channels', function(){
        return {
            selected_idx:0,
            current:'',
            channels: ['EVERYTHING', 'FAMILY', 'CHECK-IN', 'THOUGHTS', 'BLOG', 'PHOTOS', 'CODE'],
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
            current:{},
            loaded: false,
            loading: [],
            limit: 100,
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
                console.log('initinggggg');
                
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
                console.log('fetchTimeLine()');
                var self = this;        
                var params = { limit : self.limit };
                
                /* Have we already loaded the appropriate timeline? */
                if(channel.toLowerCase() == Channels.current.toLowerCase()){
                    console.log('I think we have the appropriate timeline loaded?');
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
                    console.log('chronicle is empty ...');
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
                    console.log('should be rendering', chronicle);
                    self.current = chronicle;
                    self.render(chronicle_id);
                    self.selected_idx = self.current.index;
                }
                
                console.log('callback: ' + typeof callback);
                
                if(typeof callback == 'function'){
                    console.log('callback!');
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
            }
        };
    });