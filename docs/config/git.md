# git常用命令

```
 记录目前自己学到的一些git命令
```

```
 git的所有挑选都是左开右闭
 在每次commit或者push,cherry-pick,patch 之前都要先pull，保证本地与远端的一致性，也就说保证HEAD的一致性
 避免冲突
```

## 查看日志

```
    git log
```

## 命令退出

```
   控制台: 输入q
```

## 查看具体某次提交的修改

```
    git show commitHash
```

## 查看具体提交范围(包含修改)

```
    git show commitHash1^..commitHash2
```

## 查看具体提交范围(不包含修改)

```
    git log commitHash1^..commitHash2
```

## 查看某个commitId到头
    
```
    git log commitHash..HEAD
```


## 查看当前分支

```
    git branch
```

## 提交本地

```
    git add .
    git commit -m "message"
```

## 修改远端

```
    git push origin dev
```

## 查看所有分支

```
    git branch -a
```

```
git checkout 不仅仅可以切换分支，还可以进行回滚某个文件
git checkout  --  docs\config\git.md 
git checkout  --  commitHash   fileName
注意： 这个文件不能是commit的状态
```


## 切换分支

```
    git checkout 分支名  不推荐
    git switch 分支名  推荐
    理由:  git checkout 不仅仅可以切换分支，还可以进行回滚某个文件
    作为一个容易混淆的命令，不推荐在切换分支的时候使用
```

## 迁出远端分支

```
    git checkout -b 分支名 origin/分支名
```


## 创建本地分支

```
    git branch 分支名
```

## 删除本地分支

```
    git branch -d 分支名
```

## 删除远端分支

```
   git push origin --delete   分支名
```

## 创建远端分支

```
    git branch  dev   //创建本地分支
    git push origin dev   //将本地分支推送到远端
    git branch  --set-upstream-to=origin/dev  //将本地分支与远端分支关联
    git branch  -a //查看所有分支
```

## 删除远端分支

```
    git push origin --delete dev
```

## 缓存修改

```
    git stash save "message"
```

## 查看缓存

```
    git stash list
```

## 恢复缓存

```
    git stash apply stash@{0} 这里是标号
    git stash pop stash@{0}
```

## 删除缓存

```
    git stash drop stash@{0}
```

## 清空缓存

```
    git stash clear
```

## cherry-pick

```
    git cherry-pick [<options>] <commit-ish>...
        常用options:
        --quit                退出当前的chery-pick序列
        --continue            继续当前的chery-pick序列
        --abort               取消当前的chery-pick序列，恢复当前分支
        -n, --no-commit       不自动提交
        -e, --edit            编辑提交信息
        
    git cherry-pick  -n  <commitHash> pick 一个
    git cherry-pick  -n  commitHash^..commitHash  pick 多个包含左侧
    git cherry-pick  -n  commitHash..commitHash   pick 多个不包含左侧
```

## git 创建补丁

```
注意：windows11 如果是用powerShell 创建补丁，会出现乱码，你必须打开git自己的可视化界面
注意: 无论是cherry-pick还是git diff 在不写^的情况下都是左开右闭, 而且你必须保证分支的干净

// 比较 master 分支与 dev 分支之间的差异，并将差异写入到 0001-master-dev.patch 文件中
git diff --no-prefix master..dev > 0001-master-dev.patch

// 比较从 某个提交到某个提交中的所有差异，写入到master.patch
git  diff [commitId] [commitId] > master.patch
// 检查是否可以进行应用
git apply --check master.patch
// 应用
git apply master.patch

```

## 重置提交  
<span> 重置提交<span style='color:red'>三</span>种模式</span>
 <ul>
     <li>soft: 重置到本次位置,差异保存</li>
     <li>mixed:重置到本次位置,差异保存,但是会影响变更状态记录</li>
     <li>hard: 工作区的内容完全重置成本次commitHash的文件内容</li>
 </ul>

## 重置命令


```
git reset [<mode>] [<commit>]
git rest --soft [<commit>]
git rest --mixed [<commit>]
git rest --hard [<commit>]
```

## git 错误

```
fatal: Unable to create 'E:/project/vuepress-starter/.git/index.lock': File exists.
Another git process seems to be running in this repository, e.g.
```
<ul>
    <li>你在其他地方打开了 Git 仓库的编辑器（如 Visual Studio Code）</li>
    <li>你在命令行中运行了另一个 Git 命令，但尚未完成</li>
    <li>你的计算机上有多个 Git 进程正在运行</li>
</ul>

## git 回滚

```
  git rest --hard commitHash
  git push origin HEAD --force
  git revert commitHash
  这两个命令都能让你回到代码库中之前的指定状态，但后果不同。
  git rest --hard commitHash 会让你回到指定的状态，但是会丢弃掉你之前的提交记录，也就是说你之前的提交记录会被抹掉。
  git revert commitHash 会让你回到指定的状态，但是会保留你之前的提交记录，也就是说你之前的提交记录不会被抹掉。
```

## git 回滚远端代价

```
  注意： 一定要考虑清楚   git rest 的代价，因为这个命令会抹掉你之前的提交记录，什么都没有了，删除就是删除了
  git revert  不会因为上次提交的代码还存在,你完全还有机会，在提取出来  
```
## 回滚时机

```
    revert的时候是当前条， 而reset的时候是之前的条
```


## git remote

```
git remote 命令用于用于管理 Git 仓库中的远程仓库。

git remote 命令提供了一些用于查看、添加、重命名和删除远程仓库的功能
```


```
git remote -v 查看远端仓库
origin  https://github.com/Leadgq/vue-preess.git (fetch)  // fetch 代表拉取
origin  https://github.com/Leadgq/vue-preess.git (push)   // push 代表推送
本地创建的仓库是没有远端仓库的，所以这里是空的
git remote add origin    新增远端仓库
git remote rm origin     删除远端仓库  --> 删除之后，你就不能推送到远端仓库了
git remote rename origin  <name>  重命名远端仓库
你现在从别的仓库上clone了代码，那么推送的时候，人家做了保护，
你就不能推送到别人的仓库上，你需要先删除远端仓库，然后再添加远端仓库、或者采用
git remote set-url origin  --> 重新设置远端仓库
git remote remove origin  --> 删除远端仓库
rm 和 remove 是一样的
```
## .git中的HEAD

```
git中的HEAD指向的是当前所在的分支
它记录分支的地方在.git HEAD文件中    ref: refs/heads/dev
切换分支的时候 会改变HEAD的指向
```


## .git分支中的HEAD
```
在.git配置文件夹中会存在一个 logs的文件夹，这个文件夹中会记录你的每一次操作
每当你新建立一个分支 会在logs文件夹中生成一个文件  refs--> heads--->  dev
上一次头部： 7f85239a70b4c766184f0233071e16d0e6a41ac3
本次头部： 537920012bf4a09be0a86ce3020d116a1ec4db57
作者： gaoqiang <gaoqiang@yundun119.com> 1694418648 +0800	
commit的信息 commit: [git][新增][git log 从某个id开始到头]
```

## .git中的config

```
  你所有的配置都在这里面 包括远端仓库的地址，全部在这里
```

## .git中的index

```
  index文件是暂存区的索引文件，它记录了暂存区的文件信息，包括文件名、文件的状态（新增、修改、删除）和文件的SHA-1值。
  当你执行git add命令时，Git就会根据index文件中的记录将文件内容添加到暂存区。
  当你执行git commit命令时，Git就会根据index文件中的记录将暂存区的文件提交到本地仓库。
  当你执行git reset命令时，Git就会根据index文件中的记录将暂存区的文件恢复到工作区。
  当你执行git checkout命令时，Git就会根据index文件中的记录将工作区的文件恢复到暂存区。
```


## 拉取代码区别
```
1、功能不同
git pull 和 git pull --rebase 的区别
git pull = git fetch + git merge FETCH_HEAD；
git pull –rebase = git fetch + git rebase FETCH_HEAD。
相当于git pull -rebase和git pull的不同转变为了git fetch和git merge的不同。

2、效果不同
git pull：merge操作会生成一个新的节点，之前的提交分开显示；

git pull –rebase ：rebase操作不会生成新的节点，是将两个分支融合成一个线性的提交。

如果你使用 --rebase 本地有未提交的代码是无法使用的，因为rebase会把本地的提交放到最后面，这样会导致冲突，所以在使用rebase之前一定要先提交本地的代码。
```