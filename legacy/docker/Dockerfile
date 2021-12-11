FROM archlinux/base

WORKDIR "/jhue"

CMD ["./jhue", "jhue_config.json"]

# After building the image, assuming jhue and jhue_config.json are in /data/srv/jhue, use:
# docker run -d --name=jhue -v /data/srv/jhue:/jhue --net=host --restart unless-stopped local:jhue
