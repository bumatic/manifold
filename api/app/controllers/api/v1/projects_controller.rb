module Api
  module V1
    # Projects controller
    class ProjectsController < ApplicationController

      authorize_actions_for Project, except: [:index, :show]
      before_action :set_project, only: [:show, :update, :destroy]

      # GET /projects
      def index
        @projects = Project
                    .includes(:makers, :creators, :contributors)
                    .filtered(project_filter_params[:filter])
        render json: @projects,
               include: %w(creators collaborators),
               each_serializer: ProjectPartialSerializer
      end

      # GET /projects/1
      def show
        render json: @project,
               include: %w(creators collaborators texts text_categories events
                           collections uncollected_resources)
      end

      # POST /projects
      def create
        @project = Project.new(project_params)
        if @project.save
          render json: @project, status: :created, location: [:api, :v1, @project]
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /projects/1
      def update
        if @project.update(project_params)
          render json: @project
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      # DELETE /projects/1
      def destroy
        @project.destroy
      end

      private

      def set_project
        @project = Project.includes(:texts, :creators, :contributors).find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def project_params
        params.require(:project)
      end
    end
  end
end
