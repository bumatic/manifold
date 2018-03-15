class AnnotationAuthorizer < ApplicationAuthorizer

  def self.readable_by?(_user)
    true
  end

  def self.creatable_by?(_user)
    true
  end

  def self.deletable_by?(_user)
    true
  end

  def self.updatable_by?(_user)
    true
  end

  def creatable_by?(user)
    return true unless Annotation::NOTATION_TYPES.include?(resource.format)
    user.admin? || user.editor?
  end

  def deletable_by?(user)
    resource.creator == user || user.admin? || user.editor?
  end

  def updatable_by?(user)
    resource.creator == user || user.admin? || user.editor?
  end
end
