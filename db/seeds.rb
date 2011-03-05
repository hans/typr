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
# categories:
#   1 — literary passages
#   2 — quotes
Copy.create :category => 1, :content => "There is a drowsy state, between sleeping and waking, when you dream more in five minutes with your eyes half open, and yourself half conscious of everything that is passing around you, than you would in five nights with your eyes fast closed, and your senses wrapt in perfect unconsciousness. At such time, a mortal knows just enough of what his mind is doing, to form some glimmering conception of its mighty powers, its bounding from earth and spurning time and space, when freed from the restraint of its corporeal associate.", :note => "Charles Dickens — Oliver Twist"
Copy.create :category => 2, :content => "The engineer is the key figure in the material progress of the world. It is his engineering that makes a reality of the potential value of science by translating scientific knowledge into tools, resources, energy and labor to bring them into the service of man ... To make contributions of this kind the engineer requires the imagination to visualize the needs of society and to appreciate what is possible as well as the technological and broad social age understanding to bring his vision to reality.", :note => "Sir Eric Ashby"
Copy.create :category => 2, :content => "It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood, who strives valiantly; who errs and comes short again and again; because there is not effort without error and shortcomings; but who does actually strive to do the deed; who knows the great enthusiasm, the great devotion, who spends himself in a worthy cause, who at the best knows in the end the triumph of high achievement and who at the worst, if he fails, at least he fails while daring greatly. So that his place shall never be with those cold and timid souls who know neither victory nor defeat.", :note => "Theodore Roosevelt"