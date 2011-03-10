class Users::RegistrationsController < Devise::RegistrationsController
  def update
    case params[:form_type]
    when 'edit_user'
      current_user.email = params[:user][:email]
      current_user.username = params[:user][:username]
      current_user.save
      
      render :action => 'edit', :resource => current_user
    when 'change_password'
      super
    end
  end
end