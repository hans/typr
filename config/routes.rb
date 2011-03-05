Typr::Application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => 'users/omniauth_callbacks' }

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "home#index"
  
  match "/type/compete" => "type#compete"
  match "/type/compete/room/find" => "type#find_room"
  match "/type/compete/room/:id" => "type#room_status"
  match "/type/compete/room/:id/start" => "type#start_room"
  match "/type/compete/room/:room_id/:player_id" => "type#update_player_status"
  
  match "/type/copy/:category" => "type#copy"
  match "/type/practice" => "type#practice"
  match "/type/submit" => "type#submit"
  
  match "/profiles" => "profiles#index"
  match "/profiles/save" => "profiles#save"
  match "/profiles/delete" => "profiles#delete"
  get "profiles/autocomplete_profile_keyboard"
  match "/profiles/:id" => 'profiles#view'
  
  match "/account/history" => "account#history"
  match "/account/settings" => "account#settings"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
