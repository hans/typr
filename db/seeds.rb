# coding: utf-8

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

# default profile
Profile.create :layout => "QWERTY", :keyboard => "Unknown Keyboard"

# some basic copy
Copy.create :category => 1, :content => "There is a drowsy state, between sleeping and waking, when you dream more in five minutes with your eyes half open, and yourself half conscious of everything that is passing around you, than you would in five nights with your eyes fast closed, and your senses wrapt in perfect unconsciousness. At such time, a mortal knows just enough of what his mind is doing, to form some glimmering conception of its mighty powers, its bounding from earth and spurning time and space, when freed from the restraint of its corporeal associate.", :extra => "Charles Dickens — Oliver Twist"