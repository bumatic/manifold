import React, { Component } from "react";
import PropTypes from "prop-types";
import { DefaultPlayer as Video } from "react-html5video";

export default class ResourcePlayerVideo extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  renderVideoByService(service, id) {
    let output = false;
    if (service === "vimeo") {
      output = (
        <iframe
          src={`//player.vimeo.com/video/${id}`}
          frameBorder="0"
          title={`vimeo-${id}`}
          allowFullScreen
        />
      );
    }
    if (service === "youtube") {
      output = (
        <iframe
          id="ytplayer"
          type="text/html"
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          frameBorder="0"
          title={`yt-${id}`}
          allowFullScreen
        />
      );
    }
    return (
      <div
        className="figure-video"
        ref={c => {
          this._figure = c;
        }}
      >
        {output}
      </div>
    );
  }

  renderFileVideo(resource) {
    return (
      <div className="figure-video">
        <Video controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}>
          <source
            src={resource.attributes.attachmentStyles.original}
            type="video/mp4"
          />
        </Video>
      </div>
    );
  }

  renderVideo(resource) {
    if (resource.attributes.subKind === "external_video") {
      return this.renderVideoByService(
        resource.attributes.externalType,
        resource.attributes.externalId
      );
    }
    return this.renderFileVideo(resource);
  }

  render() {
    const resource = this.props.resource;
    return this.renderVideo(resource);
  }
}
