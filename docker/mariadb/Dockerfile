# Maintained MariaDB LTS line. Persistence/backups are the owner's responsibility.
FROM mariadb:11.8
EXPOSE 3306
# Render supplies generated passwords and a disk at /var/lib/mysql.
# Limit memory/connections for the initial small private service plan.
CMD ["mariadbd", "--bind-address=0.0.0.0", "--innodb-buffer-pool-size=128M", "--max-connections=30", "--performance-schema=OFF"]
