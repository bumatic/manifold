# Provides a partial serialization of a maker model.
class MakerSerializer < ApplicationSerializer
  include Abilities
  meta(partial: false)

  attributes :id, :first_name, :last_name, :middle_name, :display_name, :full_name,
             :avatar_styles, :suffix
end
