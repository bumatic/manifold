require "rails_helper"

shared_examples_for "an authorized user for an instance" do |klass, abilities|
  include TestHelpers::AuthorizationHelpers
  extend TestHelpers::AuthorizationHelpers

  [:create, :read, :update, :delete].each do |ability|
    subject_can = is_authorized_to?(ability, abilities)
    verb = subject_can ? "can" : "can't"
    assertion = subject_can ? :to : :to_not

    it "it #{verb} #{ability} the specified #{klass.to_s.downcase}" do
      skip unless test_ability_for?(ability, abilities)
      expect(object).send(assertion, self.send(matcher_for_ability(ability), subject))
    end
  end
end

shared_examples_for "an authorized user for a class" do |klass, abilities|
  include TestHelpers::AuthorizationHelpers
  extend TestHelpers::AuthorizationHelpers

  [:create, :read, :update, :delete].each do |ability|
    subject_can = is_authorized_to?(ability, abilities)
    verb = subject_can ? "can" : "can't"
    assertion = subject_can ? :to : :to_not

    it "it #{verb} #{ability} #{indefinite_article_for(klass)}#{klass}" do
      skip unless test_ability_for?(ability, abilities)
      expect(klass).send(assertion, self.send(matcher_for_ability(ability), subject))
    end
  end
end
